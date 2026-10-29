import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toolsData, type ToolItem } from '../data/tools';

interface ToolMarqueeProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

export const ToolMarquee: React.FC<ToolMarqueeProps> = ({ sectionRef }) => {

  // Mouse tilt position for interactive 3D pointer response
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentTarget = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      const rect = currentTarget.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
      rafRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setMousePos({ x: 0, y: 0 });
  };

  // Scroll offset for velocity dynamics
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const scrollOffset = useTransform(scrollYProgress, [0, 1], [-35, 35]);

  // Duplicate tools array 4 times for a seamless horizontal marquee field
  const duplicatedTools = [
    ...toolsData,
    ...toolsData,
    ...toolsData,
    ...toolsData,
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden py-14 select-none [perspective:1200px]"
    >
      {/* Soft Edge Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-20 pointer-events-none" />

      {/* Infinite 3D Tool Field Row */}
      <motion.div
        style={{ x: scrollOffset }}
        className="flex items-center gap-6 sm:gap-8 w-max [transform-style:preserve-3d]"
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 34,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="flex items-center gap-6 sm:gap-8 w-max [transform-style:preserve-3d]"
        >
          {duplicatedTools.map((tool, idx) => (
            <ToolCard3D key={`${tool.id}-${idx}`} tool={tool} mousePos={mousePos} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

interface ToolCard3DProps {
  tool: ToolItem;
  mousePos: { x: number; y: number };
}

const ToolCard3D: React.FC<ToolCard3DProps> = ({ tool, mousePos }) => {
  // Mouse tilt parameters (max ±4 deg)
  const tiltX = mousePos.y * -5;
  const tiltY = mousePos.x * 5;

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: tiltX,
        rotateY: tiltY,
      }}
      whileHover={{
        scale: 1.05,
        y: -6,
        translateZ: 14,
      }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative flex flex-col items-center justify-between w-[140px] h-[130px] sm:w-[165px] sm:h-[145px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#181818] via-[#111111] to-[#0A0A0A] border border-white/10 group-hover:border-white/30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.85)] p-4 cursor-pointer backdrop-blur-md transition-all duration-300"
    >
      {/* Inner Highlight Reflection */}
      <div
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 40}% ${
            50 + mousePos.y * 40
          }%, rgba(255,255,255,0.12), transparent 70%)`,
        }}
        className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Surface Radial Light Behind Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)] group-hover:bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)] transition-colors duration-300" />
      </div>

      {/* Layer 2: Elevated Authentic Software Logo Asset (translateZ 12px) */}
      <div
        style={{ transform: 'translateZ(12px)', transformStyle: 'preserve-3d' }}
        className="flex-1 flex items-center justify-center w-full pt-1 z-10"
      >
        <img
          src={tool.logo}
          alt={tool.name}
          className="w-11 h-11 sm:w-13 sm:h-13 object-contain opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Layer 3: Elevated Full Tool Name (translateZ 6px) */}
      <div
        style={{ transform: 'translateZ(6px)' }}
        className="w-full text-center pb-0.5 z-10"
      >
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#646973] group-hover:text-[#D7E2EA] font-semibold transition-colors duration-300 block truncate max-w-full select-none">
          {tool.name}
        </span>
      </div>
    </motion.div>
  );
};

export default ToolMarquee;
