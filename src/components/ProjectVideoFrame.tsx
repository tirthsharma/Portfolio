import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { Film } from 'lucide-react';
import { previewCoordinator } from '../utils/previewCoordinator';
import { VideoLightboxModal } from './VideoLightboxModal';

interface ProjectVideoFrameProps {
  videoId?: string;
  poster?: string;
  title: string;
  playerId?: string;
  className?: string;
  isVertical?: boolean;
}

export const ProjectVideoFrame: React.FC<ProjectVideoFrameProps> = ({
  videoId,
  poster,
  title,
  playerId,
  className = '',
  isVertical = false,
}) => {
  const generatedId = useId();
  const frameId = playerId || generatedId;

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ytPlayerRef = useRef<{
    destroy?: () => void;
    seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
  } | null>(null);

  // Box dimensions for hover preview iframe cover measurement
  const [boxDimensions, setBoxDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Hover and playback state
  const [isHovered, setIsHovered] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Thumbnail fallback state:
  // 1. If poster is set, try poster.
  // 2. If poster is empty or fails, use https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg.
  // 3. If that fails too, use https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg.
  const posterUrl = poster?.trim() || '';
  const hqUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  const mqUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';

  const initialStep: 'poster' | 'hq' | 'mq' | 'failed' = posterUrl ? 'poster' : 'hq';
  const [thumbStep, setThumbStep] = useState<'poster' | 'hq' | 'mq' | 'failed'>(initialStep);
  const [prevPropsKey, setPrevPropsKey] = useState(`${videoId}:${posterUrl}`);

  if (`${videoId}:${posterUrl}` !== prevPropsKey) {
    setPrevPropsKey(`${videoId}:${posterUrl}`);
    setThumbStep(posterUrl ? 'poster' : 'hq');
  }

  const currentThumbSrc =
    thumbStep === 'poster'
      ? posterUrl
      : thumbStep === 'hq'
        ? hqUrl
        : thumbStep === 'mq'
          ? mqUrl
          : '';

  const handleThumbError = () => {
    if (thumbStep === 'poster') {
      setThumbStep('hq');
    } else if (thumbStep === 'hq') {
      setThumbStep('mq');
    } else {
      setThumbStep('failed');
    }
  };

  // Timers
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewLoopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackPlayingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Measure box size for hover preview cover sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateDimensions = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setBoxDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Stop & cleanup preview helper
  const stopPreview = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (previewLoopTimerRef.current) {
      clearTimeout(previewLoopTimerRef.current);
      previewLoopTimerRef.current = null;
    }
    if (fallbackPlayingTimerRef.current) {
      clearTimeout(fallbackPlayingTimerRef.current);
      fallbackPlayingTimerRef.current = null;
    }

    setIsPlayerPlaying(false);
    setShowIframe(false);

    if (ytPlayerRef.current?.destroy) {
      try {
        ytPlayerRef.current.destroy();
      } catch {
        // Ignore destruction errors
      }
      ytPlayerRef.current = null;
    }

    previewCoordinator.clear(frameId);
  }, [frameId]);

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, [stopPreview]);

  // Listen to postMessage from YouTube iframe for PLAYING state
  useEffect(() => {
    if (!showIframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        const isPlaying =
          (data.event === 'onStateChange' && data.info === 1) ||
          (data.event === 'infoDelivery' && data.info?.playerState === 1);

        if (isPlaying) {
          setIsPlayerPlaying(true);
        }
      } catch {
        // Ignore unrelated message events
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [showIframe]);

  // Handle ~8-second loop when preview starts playing
  useEffect(() => {
    if (!isPlayerPlaying || !showIframe) return;

    if (previewLoopTimerRef.current) {
      clearTimeout(previewLoopTimerRef.current);
    }

    previewLoopTimerRef.current = setTimeout(() => {
      try {
        if (ytPlayerRef.current?.seekTo) {
          ytPlayerRef.current.seekTo(0, true);
        } else if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
            '*'
          );
        }
      } catch {
        // Silently catch postMessage errors
      }
    }, 8000);

    return () => {
      if (previewLoopTimerRef.current) {
        clearTimeout(previewLoopTimerRef.current);
        previewLoopTimerRef.current = null;
      }
    };
  }, [isPlayerPlaying, showIframe]);

  // Desktop hover handler (300ms delay, touch devices ignored, reduced motion respected)
  const handleMouseEnter = () => {
    if (typeof window === 'undefined') return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canHover || prefersReducedMotion) {
      return;
    }

    setIsHovered(true);

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    // 300ms hover delay
    hoverTimerRef.current = setTimeout(() => {
      previewCoordinator.setActive(frameId, stopPreview);
      setShowIframe(true);

      // Safeguard timer: reveal playing video after 1.4s if postMessage is slow
      fallbackPlayingTimerRef.current = setTimeout(() => {
        setIsPlayerPlaying(true);
      }, 1400);
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopPreview();
  };

  // Click handler: opens lightbox with sound, stops any ongoing preview
  const handleClick = () => {
    stopPreview();
    setIsLightboxOpen(true);
  };

  const handleIframeLoad = () => {
    if (!iframeRef.current) return;

    try {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
    } catch {
      // Ignore
    }

    if (window.YT && window.YT.Player) {
      try {
        ytPlayerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onStateChange: (event: { data: number }) => {
              if (event.data === (window.YT?.PlayerState?.PLAYING ?? 1)) {
                setIsPlayerPlaying(true);
              }
            },
          },
        });
      } catch {
        // Handled by postMessage fallback
      }
    }
  };

  if (!videoId) return null;

  // Calculate dimensions for preview iframe to cover the box completely
  const { width: boxW, height: boxH } = boxDimensions;
  let iframeW = '100%';
  let iframeH = '100%';

  if (boxW > 0 && boxH > 0) {
    if (isVertical) {
      const frameHeight = Math.max(boxH, boxW * (16 / 9));
      iframeH = `${frameHeight}px`;
      iframeW = `${frameHeight * (16 / 9)}px`;
    } else {
      iframeW = `${Math.max(boxW, boxH * (16 / 9))}px`;
      iframeH = `${Math.max(boxH, boxW * (9 / 16))}px`;
    }
  }

  // Hover preview embed URL: muted, autoplay, controls=0, rel=0, loop=1
  const previewEmbedUrl = showIframe
    ? `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&fs=0&disablekb=1&loop=1&playlist=${videoId}`
    : '';

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Play video: ${title}`}
        className={`group relative w-full h-full bg-[#141414] border border-[#222222] rounded-[inherit] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0C] select-none ${className}`}
      >
        {/* Hover Preview IFrame (Mounted only during hover after 300ms) */}
        {showIframe && (
          <iframe
            ref={iframeRef}
            src={previewEmbedUrl}
            title={`${title} - Preview`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            tabIndex={-1}
            onLoad={handleIframeLoad}
            style={{
              width: iframeW,
              height: iframeH,
            }}
            className={
              isVertical
                ? 'project-preview-iframe-vertical'
                : 'project-preview-iframe-horizontal'
            }
          />
        )}

        {/* Thumbnail Image: visible by default (opacity 1), fills box, #141414 behind it */}
        {thumbStep !== 'failed' && currentThumbSrc ? (
          <img
            src={currentThumbSrc}
            alt={title}
            onError={handleThumbError}
            className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-10 transition-opacity duration-300 ${
              isPlayerPlaying ? 'opacity-0' : 'opacity-100'
            }`}
          />
        ) : (
          /* Graceful Dark Grid Placeholder Fallback */
          <div
            className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 bg-[#141414] transition-opacity duration-300 z-10 ${
              isPlayerPlaying ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
            <Film className="w-8 h-8 stroke-[1.25] text-neutral-500 opacity-60" />
          </div>
        )}

        {/* Subtle Dark Vignette Overlay */}
        <div
          className={`absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-opacity duration-300 pointer-events-none z-10 ${
            isPlayerPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Custom Translucent Glass Circle Play Button with White Triangle */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-300 ${
            isHovered || isPlayerPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105">
            <svg
              className="w-5 h-5 text-white fill-white ml-0.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Opens on click/tap with full video and sound) */}
      <VideoLightboxModal
        isOpen={isLightboxOpen}
        videoId={videoId}
        title={title}
        isVertical={isVertical}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
};

export default ProjectVideoFrame;
