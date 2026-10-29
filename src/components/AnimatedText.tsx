import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharacterProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-20 select-none">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0 select-none">
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const wordsWithOffsets = React.useMemo(() => {
    return text.split(' ').reduce<Array<{ word: string; chars: string[]; startIndex: number }>>(
      (acc, word) => {
        const last = acc[acc.length - 1];
        const startIndex = last ? last.startIndex + last.word.length + 1 : 0;
        acc.push({
          word,
          chars: word.split(''),
          startIndex,
        });
        return acc;
      },
      []
    );
  }, [text]);

  const totalChars = text.length;

  return (
    <p
      ref={containerRef}
      className={`text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px] text-[clamp(1rem,2vw,1.35rem)] ${className}`}
    >
      {wordsWithOffsets.map(({ word, chars, startIndex }, wordIndex) => (
        <React.Fragment key={`${word}-${wordIndex}`}>
          <span className="inline-block whitespace-nowrap">
            {chars.map((char, charIndex) => {
              const globalIndex = startIndex + charIndex;
              const start = globalIndex / totalChars;
              const end = (globalIndex + 1) / totalChars;

              return (
                <Character
                  key={charIndex}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </span>
          {wordIndex < wordsWithOffsets.length - 1 && ' '}
        </React.Fragment>
      ))}
    </p>
  );
};

export default AnimatedText;
