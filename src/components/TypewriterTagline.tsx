import React, { useEffect, useMemo, useRef, useState } from 'react';

interface TypewriterTaglineProps {
  text?: string;
  texts?: string[];
  className?: string;
  speedMs?: number;
  pauseBetweenMs?: number;
}

export const TypewriterTagline: React.FC<TypewriterTaglineProps> = ({
  text,
  texts,
  className = '',
  speedMs = 32,
  pauseBetweenMs = 2800,
}) => {
  const textList = useMemo(() => {
    if (texts && texts.length > 0) {
      return texts.map((t) => t.toUpperCase());
    }
    if (text) {
      return [text.toUpperCase()];
    }
    return [''];
  }, [text, texts]);

  // Find longest text to reserve bounding box and prevent Cumulative Layout Shift (CLS)
  const longestText = useMemo(() => {
    return textList.reduce(
      (longest, current) => (current.length > longest.length ? current : longest),
      textList[0] || ''
    );
  }, [textList]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isCaretBlinking, setIsCaretBlinking] = useState<boolean>(true);
  const [isFading, setIsFading] = useState<boolean>(false);

  const activeText = textList[currentIndex] || '';
  const effectiveLength = displayedLength;
  const effectiveShowCaret = true;

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const currentLengthRef = useRef<number>(0);

  useEffect(() => {
    isMountedRef.current = true;
    currentLengthRef.current = 0;

    const clearAllTimers = () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };

    const targetText = textList[currentIndex] || '';

    const typeNextChar = () => {
      if (!isMountedRef.current) return;

      currentLengthRef.current += 1;
      setDisplayedLength(currentLengthRef.current);

      if (currentLengthRef.current < targetText.length) {
        typingTimeoutRef.current = setTimeout(typeNextChar, speedMs);
      } else {
        // Typing finished for this phrase!
        setIsCaretBlinking(true);

        if (textList.length > 1) {
          pauseTimeoutRef.current = setTimeout(() => {
            if (!isMountedRef.current) return;

            // Smooth fade out transition
            setIsFading(true);
            fadeTimeoutRef.current = setTimeout(() => {
              if (!isMountedRef.current) return;
              setDisplayedLength(0);
              setIsFading(false);
              setCurrentIndex((prev) => (prev + 1) % textList.length);
            }, 300);
          }, pauseBetweenMs);
        }
      }
    };

    // Brief initial pause before typing starts
    typingTimeoutRef.current = setTimeout(typeNextChar, 250);

    return () => {
      isMountedRef.current = false;
      clearAllTimers();
    };
  }, [currentIndex, textList, speedMs, pauseBetweenMs]);

  return (
    <div
      className={`relative text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[170px] sm:max-w-[240px] md:max-w-[300px] text-[clamp(0.75rem,1.3vw,1.35rem)] ${className}`}
    >
      {/* Invisible layout placeholder: preserves exact multi-line height & wrapping to prevent CLS */}
      <p className="invisible select-none pointer-events-none" aria-hidden="true">
        {longestText}
      </p>

      {/* Active typewriter overlay: smoothly aligned within reserved bounds */}
      <p
        className={`absolute inset-0 select-text transition-opacity duration-300 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
        aria-label={activeText}
      >
        <span>{activeText.slice(0, effectiveLength)}</span>
        {effectiveShowCaret && (
          <span className="inline-block w-0 overflow-visible relative align-baseline">
            <span
              aria-hidden="true"
              className={`inline-block w-[2px] h-[0.95em] align-baseline ml-[1px] bg-[#D7E2EA] transition-opacity duration-300 ${
                isCaretBlinking ? 'animate-caret-blink' : 'opacity-0'
              }`}
            />
          </span>
        )}
      </p>
    </div>
  );
};

export default TypewriterTagline;
