import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface VideoLightboxModalProps {
  isOpen: boolean;
  videoId: string;
  title: string;
  isVertical?: boolean;
  onClose: () => void;
}

export const VideoLightboxModal: React.FC<VideoLightboxModalProps> = ({
  isOpen,
  videoId,
  title,
  isVertical = false,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Handle ESC key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Lock body scroll while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const cleanVideoId = (() => {
    const trimmed = (videoId || '').trim();
    if (!trimmed) return '';
    if (trimmed.includes('youtube.com/shorts/')) {
      return trimmed.split('youtube.com/shorts/')[1].split(/[?&#]/)[0];
    }
    if (trimmed.includes('youtu.be/')) {
      return trimmed.split('youtu.be/')[1].split(/[?&#]/)[0];
    }
    if (trimmed.includes('watch')) {
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match && match[1]) return match[1];
    }
    if (trimmed.includes('embed/')) {
      return trimmed.split('embed/')[1].split(/[?&#]/)[0];
    }
    return trimmed;
  })();

  if (!isOpen || !cleanVideoId || typeof document === 'undefined') {
    return null;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${cleanVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Playing video: ${title}`}
      className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-10 select-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA]"
        aria-label="Close video"
      >
        <X className="w-6 h-6 stroke-[2]" />
      </button>

      {/* Video Container Box */}
      <div
        className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/15 flex items-center justify-center ${
          isVertical
            ? 'aspect-[9/16] max-w-[420px] max-h-[88vh]'
            : 'aspect-[16/9] max-w-5xl max-h-[82vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>,
    document.body
  );
};

export default VideoLightboxModal;
