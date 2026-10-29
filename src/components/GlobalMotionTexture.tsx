import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const GlobalMotionTexture: React.FC = () => {

  // Track global page scroll progress (0 to 1)
  const { scrollYProgress } = useScroll();

  // Multi-speed Parallax mappings for structural depth
  // Layer 1 Dot Field Parallax
  const dotFieldY = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const dotFieldX = useTransform(scrollYProgress, [0, 1], [0, 20]);

  // Layer 2 Technical Lines Parallax (Slow, Medium, Fast speeds)
  const lineSpeedSlowY = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const lineSpeedMedY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const lineSpeedFastY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Layer 4 Atmospheric Ambient Glow Parallax
  const ambientGlowY = useTransform(scrollYProgress, [0, 1], [-15, 30]);

  // Section-Aware Intensity Mapping across page scroll height:
  // Hero (~0.0-0.15): 0.5 opacity
  // Marquee (~0.15-0.25): 0.7 opacity
  // About (~0.25-0.42): 0.5 opacity
  // Services (~0.42-0.58): 0.0 opacity (White section - texture fades to 0)
  // Projects (~0.58-0.78): 0.7 opacity
  // Experience (~0.78-1.0): 1.0 opacity
  const globalOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.22, 0.35, 0.42, 0.45, 0.56, 0.60, 0.75, 0.85, 1.0],
    [0.5, 0.5,  0.7,  0.5,  0.5,  0.0,  0.0,  0.7,  0.7,  1.0,  1.0]
  );

  return (
    <motion.div
      style={{ opacity: globalOpacity }}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ============================================================ */}
      {/* LAYER 1 — DYNAMIC DOT FIELD                                 */}
      {/* ============================================================ */}
      <motion.div
        style={{ y: dotFieldY, x: dotFieldX }}
        className="absolute -inset-10 bg-[radial-gradient(circle,rgba(215,226,234,0.06)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"
      />

      {/* ============================================================ */}
      {/* LAYER 4 — ATMOSPHERIC AMBIENT LIGHT GRADIENTS                */}
      {/* ============================================================ */}
      <motion.div
        style={{ y: ambientGlowY }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Top-Left Subtle Ambient Glow */}
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(187,204,215,0.025),transparent_65%)]" />
        {/* Mid-Right Subtle Ambient Glow */}
        <div className="absolute top-[50%] right-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(215,226,234,0.02),transparent_60%)]" />
        {/* Bottom-Center Ambient Glow */}
        <div className="absolute bottom-[10%] left-[30%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(100,105,115,0.03),transparent_70%)]" />
      </motion.div>

      {/* ============================================================ */}
      {/* LAYER 2 & 3 — TECHNICAL LINE NETWORK & NODES (DESKTOP & MOB) */}
      {/* ============================================================ */}

      {/* Layer 2: SVG Construction Lines - Parallax Group 1 (Slow) */}
      <motion.svg
        style={{ y: lineSpeedSlowY }}
        className="absolute inset-0 w-full h-full stroke-[#D7E2EA] fill-none"
        strokeWidth="0.75"
      >
        {/* Top Left Guide */}
        <line x1="5%" y1="12%" x2="20%" y2="12%" strokeDasharray="4 4" opacity="0.06" />
        <line x1="20%" y1="12%" x2="20%" y2="18%" strokeDasharray="4 4" opacity="0.04" />
        <circle cx="5%" cy="12%" r="2" className="fill-[#D7E2EA]/15 stroke-none" />

        {/* Upper Right Construction Corner */}
        <line x1="82%" y1="24%" x2="94%" y2="24%" strokeDasharray="3 3" opacity="0.05" />
        <circle cx="94%" cy="24%" r="2" className="fill-[#D7E2EA]/20 stroke-none" />

        {/* Lower Right Technical Guide */}
        <line x1="75%" y1="78%" x2="90%" y2="78%" strokeDasharray="4 4" opacity="0.06" />
        <circle cx="75%" cy="78%" r="2" className="fill-[#D7E2EA]/15 stroke-none" />
      </motion.svg>

      {/* Layer 2: SVG Construction Lines - Parallax Group 2 (Medium) */}
      <motion.svg
        style={{ y: lineSpeedMedY }}
        className="hidden md:block absolute inset-0 w-full h-full stroke-[#D7E2EA] fill-none"
        strokeWidth="0.75"
      >
        {/* Left Middle Vertical Segment */}
        <line x1="12%" y1="35%" x2="12%" y2="48%" strokeDasharray="2 4" opacity="0.05" />
        <circle cx="12%" cy="35%" r="2.5" className="fill-[#D7E2EA]/20 stroke-none" />

        {/* Right Middle Horizontal Segment */}
        <line x1="70%" y1="62%" x2="86%" y2="62%" strokeDasharray="3 3" opacity="0.06" />
        <circle cx="86%" cy="62%" r="2.5" className="fill-[#D7E2EA]/25 stroke-none" />

        {/* Bottom Left Technical Mark */}
        <line x1="8%" y1="88%" x2="22%" y2="88%" strokeDasharray="4 4" opacity="0.05" />
        <circle cx="22%" cy="88%" r="2" className="fill-[#D7E2EA]/20 stroke-none" />
      </motion.svg>

      {/* Layer 2: SVG Construction Lines - Parallax Group 3 (Fast) */}
      <motion.svg
        style={{ y: lineSpeedFastY }}
        className="hidden lg:block absolute inset-0 w-full h-full stroke-[#BBCCD7] fill-none"
        strokeWidth="0.75"
      >
        {/* Mid Section Diagonal Connector */}
        <line x1="85%" y1="38%" x2="88%" y2="45%" strokeDasharray="2 3" opacity="0.04" />
        <circle cx="85%" cy="38%" r="2" className="fill-[#BBCCD7]/15 stroke-none" />
        <circle cx="88%" cy="45%" r="2" className="fill-[#BBCCD7]/15 stroke-none" />

        {/* Lower Center Minimal Technical Fragment */}
        <line x1="32%" y1="82%" x2="44%" y2="82%" strokeDasharray="3 3" opacity="0.04" />
        <circle cx="32%" cy="82%" r="2" className="fill-[#BBCCD7]/20 stroke-none" />
      </motion.svg>

      {/* ============================================================ */}
      {/* LAYER 3 — SUBTLE ANIMATED NODES WITH OUTER RINGS             */}
      {/* ============================================================ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Node 1: Top Right */}
        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] right-[18%] w-2 h-2 rounded-full border border-[#D7E2EA]/30 bg-[#D7E2EA]/10"
        />

        {/* Node 2: Mid Left */}
        <motion.div
          animate={{ opacity: [0.1, 0.22, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="hidden sm:block absolute top-[42%] left-[8%] w-2.5 h-2.5 rounded-full border border-[#BBCCD7]/35 bg-[#BBCCD7]/15"
        />

        {/* Node 3: Mid Right */}
        <motion.div
          animate={{ opacity: [0.06, 0.16, 0.06] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="hidden md:block absolute top-[68%] right-[12%] w-2 h-2 rounded-full border border-[#D7E2EA]/30 bg-[#D7E2EA]/10"
        />

        {/* Node 4: Lower Left */}
        <motion.div
          animate={{ opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute top-[85%] left-[14%] w-2 h-2 rounded-full border border-[#646973]/40 bg-[#646973]/20"
        />
      </div>
    </motion.div>
  );
};

export default GlobalMotionTexture;
