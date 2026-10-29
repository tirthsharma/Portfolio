import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { row1HeroVideos, row2HeroVideos } from '../data/heroVideos';
import HeroMarqueeCard from '../components/HeroMarqueeCard';

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // GPU-accelerated scroll tracking without React state updates or layout thrashing
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const row1X = useTransform(scrollYProgress, [0, 1], [-250, 150]);
  const row2X = useTransform(scrollYProgress, [0, 1], [150, -250]);

  // Triple the items array for continuous scrolling loop (reuses same video URLs)
  const tripledRow1 = [...row1HeroVideos, ...row1HeroVideos, ...row1HeroVideos];
  const tripledRow2 = [...row2HeroVideos, ...row2HeroVideos, ...row2HeroVideos];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3 pointer-events-auto"
    >
      {/* Row 1 - Moves RIGHT on scroll (Items 1-6) */}
      <div className="w-full overflow-hidden pointer-events-auto">
        <motion.div
          className="flex gap-3 w-max pointer-events-auto"
          style={{ x: row1X }}
        >
          {tripledRow1.map((item, i) => (
            <HeroMarqueeCard key={`row1-${item.id}-${i}`} item={item} index={i} />
          ))}
        </motion.div>
      </div>

      {/* Row 2 - Moves LEFT on scroll (Items 7-12) */}
      <div className="w-full overflow-hidden pointer-events-auto">
        <motion.div
          className="flex gap-3 w-max pointer-events-auto"
          style={{ x: row2X }}
        >
          {tripledRow2.map((item, i) => (
            <HeroMarqueeCard key={`row2-${item.id}-${i}`} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MarqueeSection;
