import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { Film } from 'lucide-react';
import type { HeroVideoConfig } from '../data/heroVideos';
import { heroVideoCoordinator } from '../utils/heroVideoCoordinator';
import { VideoLightboxModal } from './VideoLightboxModal';

interface HeroMarqueeCardProps {
  item: HeroVideoConfig;
  index: number;
}

export const HeroMarqueeCard: React.FC<HeroMarqueeCardProps> = ({ item, index }) => {
  const generatedId = useId();
  const cardId = `hero-video-${item.id}-${index}-${generatedId}`;

  const videoRef = useRef<HTMLVideoElement>(null);
  const isLoadedRef = useRef<boolean>(false);

  const [posterLoaded, setPosterLoaded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Desktop hover movement timing
  const hoverStartTimeRef = useRef<number>(0);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch press-and-hold refs
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didTriggerHoldRef = useRef<boolean>(false);

  const hasYouTube = Boolean(item.youtube && item.youtube.trim().length > 0);

  // Real leave: pause video, reset to 0, fade poster back in
  const stopPreview = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    const vid = videoRef.current;
    if (vid) {
      try {
        vid.pause();
        vid.currentTime = 0;
      } catch {
        // Silently catch pause errors
      }
    }

    setIsPlaying(false);
    heroVideoCoordinator.stopActive(cardId);
  }, [cardId]);

  // Hover start: load and play preview
  const startPreview = useCallback(() => {
    // Cancel any pending leave timeout so re-entering continues playback seamlessly
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    hoverStartTimeRef.current = Date.now();

    const vid = videoRef.current;
    if (!vid) return;

    // Guarantee only ONE preview plays at a time
    heroVideoCoordinator.playActive(cardId, stopPreview);

    // Set DOM properties directly in code
    vid.muted = true;
    vid.defaultMuted = true;
    vid.playsInline = true;
    vid.loop = true;

    // Load video on first interaction only
    if (!isLoadedRef.current || !vid.src || !vid.src.includes(item.videoUrl)) {
      vid.src = item.videoUrl;
      vid.load();
      isLoadedRef.current = true;
    }

    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise
        .catch(() => {
          // Retry once on canplay event
          const onCanPlay = () => {
            vid.removeEventListener('canplay', onCanPlay);
            vid.muted = true;
            vid.play().catch(() => {});
          };
          vid.addEventListener('canplay', onCanPlay, { once: true });
        });
    }
  }, [cardId, item.videoUrl, stopPreview]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
      stopPreview();
    };
  }, [stopPreview]);

  // Schedule leave with ~150ms delay to accommodate marquee motion under pointer
  const scheduleLeave = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }

    const timeSinceHover = Date.now() - hoverStartTimeRef.current;
    const delay = Math.max(150, 150 - timeSinceHover);

    leaveTimeoutRef.current = setTimeout(() => {
      stopPreview();
      leaveTimeoutRef.current = null;
    }, delay);
  }, [stopPreview]);

  // Desktop pointer/mouse handlers
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    startPreview();
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    scheduleLeave();
  };

  // Touch handlers: press and hold ~150ms
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;

    touchStartPos.current = { x: e.clientX, y: e.clientY };
    didTriggerHoldRef.current = false;

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }

    holdTimerRef.current = setTimeout(() => {
      didTriggerHoldRef.current = true;
      startPreview();
    }, 150);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;

    const dx = e.clientX - touchStartPos.current.x;
    const dy = e.clientY - touchStartPos.current.y;
    const distance = Math.hypot(dx, dy);

    // Cancel if scrolled > 10px
    if (distance > 10) {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (didTriggerHoldRef.current) {
        stopPreview();
        didTriggerHoldRef.current = false;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (didTriggerHoldRef.current) {
      stopPreview();
      // Suppress subsequent click event
      setTimeout(() => {
        didTriggerHoldRef.current = false;
      }, 100);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (didTriggerHoldRef.current) {
      stopPreview();
      didTriggerHoldRef.current = false;
    }
  };

  // Click handler: quick tap opens lightbox if youtube link exists; long press does not trigger click
  const handleClick = (e: React.MouseEvent) => {
    if (didTriggerHoldRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didTriggerHoldRef.current = false;
      return;
    }

    if (hasYouTube) {
      stopPreview();
      setIsLightboxOpen(true);
    }
  };

  return (
    <>
      <div
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onMouseEnter={startPreview}
        onMouseLeave={scheduleLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: 'none' }}
        className={`group relative w-[300px] sm:w-[360px] md:w-[420px] h-[190px] sm:h-[230px] md:h-[270px] aspect-[14/9] flex-shrink-0 rounded-2xl overflow-hidden bg-[#121212] border border-[#222222] select-none touch-pan-y pointer-events-auto ${
          hasYouTube ? 'cursor-pointer hover:border-[#333333]' : 'cursor-default'
        }`}
      >
        {/* 1. Film-icon skeleton placeholder (visible before poster loads) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#141414] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
          <Film className="w-6 h-6 stroke-[1.25] text-neutral-600 opacity-60" />
        </div>

        {/* 2. Poster image: default state, fades out once video fires native 'playing' event */}
        <img
          src={item.posterUrl}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setPosterLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-none transition-opacity duration-500 z-10 ${
            posterLoaded && !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* 3. Looping video preview: muted, loop, playsinline, preload="none" */}
        <video
          ref={videoRef}
          poster={item.posterUrl}
          muted
          loop
          playsInline
          preload="none"
          draggable={false}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-none"
        />

        {/* 4. Translucent glass play button: only shown for cards with a youtube link, fades in on hover */}
        {hasYouTube && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        )}
      </div>

      {/* Lightbox Modal: 16:9 for landscape hero videos, unmounted when closed */}
      {hasYouTube && (
        <VideoLightboxModal
          isOpen={isLightboxOpen}
          videoId={item.youtube || ''}
          title={`Hero Video ${item.id}`}
          isVertical={false}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};

export default HeroMarqueeCard;
