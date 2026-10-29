import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import { experienceData } from '../data/experience';
import type { ExperienceItem } from '../types';

export const ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll progress for the continuous Experience section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 65%', 'end 80%'],
  });

  // Central vertical timeline progress fill height
  const timelineProgressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full bg-[#0C0C0C] text-[#D7E2EA] px-4 sm:px-8 md:px-10 pt-20 pb-28 z-10 overflow-hidden"
    >
      {/* Experience Section inherits GlobalMotionTexture from App root */}

      {/* ============================================================ */}
      {/* MAIN SECTION CONTENT                                         */}
      {/* ============================================================ */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Intro Header */}
        <FadeIn delay={0} y={40} className="w-full text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-[#D7E2EA]/50 mb-3 block">
            PROFESSIONAL JOURNEY
          </span>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,11vw,140px)]">
            EXPERIENCE
          </h2>
        </FadeIn>

        {/* Continuous Vertical Timeline Container */}
        <div className="relative w-full my-2">
          {/* Base Central Timeline Track Line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[1px] bg-[#D7E2EA]/15 -translate-x-1/2 pointer-events-none z-0" />

          {/* Progressive Scroll Draw Fill Line */}
          <motion.div
            style={{ height: timelineProgressHeight }}
            className="absolute left-6 md:left-1/2 top-4 w-[2px] bg-gradient-to-b from-[#646973] via-[#BBCCD7] to-[#FFFFFF] -translate-x-1/2 origin-top pointer-events-none z-0 shadow-[0_0_8px_rgba(255,255,255,0.7)]"
          />

          {/* All 4 Experience Timeline Rows (Tightened Vertical Rhythm 260px-330px) */}
          <div className="flex flex-col gap-8 sm:gap-12 md:gap-14 relative z-10">
            {experienceData.map((item, index) => (
              <TimelineRowItem
                key={item.id}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Final Ending Section Statement */}
        <FadeIn delay={0.1} y={30} className="w-full max-w-4xl mx-auto text-center pt-16 mt-16 border-t border-[#D7E2EA]/15">
          <h3 className="hero-heading font-black uppercase leading-tight tracking-tight text-[clamp(2rem,6.5vw,80px)] mb-6">
            ALL OF IT<br />
            SHAPED HOW<br />
            I WORK TODAY.
          </h3>
          <p className="text-sm sm:text-base md:text-xl font-light text-[#D7E2EA]/80 leading-relaxed max-w-2xl mx-auto">
            &quot;After training 3000+ editors, I know what works on screen and why. That&apos;s what goes into every motion piece I make for you.&quot;
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

interface TimelineRowItemProps {
  item: ExperienceItem;
  index: number;
}

const TimelineRowItem: React.FC<TimelineRowItemProps> = ({
  item,
  index,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  // Extract starting year for large editorial ghost typography (e.g., '2024')
  const startYear = item.period.split(' ')[0] || '2024';

  // Track individual row scroll position inside the viewport
  const { scrollYProgress: rowScroll } = useScroll({
    target: rowRef,
    offset: ['start 85%', 'end 15%'],
  });

  // Opacity interpolation: Previous (0.45), Active (1.0), Next (0.4)
  const rowOpacity = useTransform(
    rowScroll,
    [0, 0.3, 0.7, 1],
    [0.4, 1.0, 1.0, 0.45]
  );

  // Smooth Y movement for row entry
  const rowY = useTransform(
    rowScroll,
    [0, 0.3],
    [12, 0]
  );

  // Ghost Year parallax translateY (-30px -> 30px) and subtle opacity (0.02 -> 0.045)
  const ghostY = useTransform(rowScroll, [0, 1], [-30, 30]);
  const ghostOpacity = useTransform(
    rowScroll,
    [0, 0.35, 0.65, 1],
    [0.02, 0.045, 0.045, 0.02]
  );

  // Horizontal connector line length & opacity (inactive: scaleX ~0.25, active: scaleX 1.0)
  const connectorScaleX = useTransform(
    rowScroll,
    [0.1, 0.35],
    [0.25, 1.0]
  );
  const connectorOpacity = useTransform(
    rowScroll,
    [0.1, 0.35],
    [0.35, 1.0]
  );

  // Timeline node dot scale and brightness interpolation
  const nodeScale = useTransform(
    rowScroll,
    [0.1, 0.35, 0.65, 0.9],
    [0.9, 1.3, 1.3, 0.9]
  );

  // Parallax translation for subtle technical background SVG guide lines
  const techSvgY = useTransform(
    rowScroll,
    [0, 1],
    index % 2 === 0 ? [-12, 12] : [15, -15]
  );
  const techSvgX = useTransform(
    rowScroll,
    [0, 1],
    index % 2 === 0 ? [-8, 8] : [10, -10]
  );

  // Responsibilities list for Tharun Speaks
  const tharunResponsibilities = [
    'SALES',
    'PEOPLE MANAGEMENT',
    'CONTENT WRITING',
    'VIDEO EDITING',
    'SPEAKING SESSIONS',
  ];

  return (
    <motion.div
      ref={rowRef}
      style={{ opacity: rowOpacity, y: rowY }}
      className="relative w-full flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-300 min-h-[240px] sm:min-h-[270px] md:min-h-[290px] py-4"
    >
      {/* ============================================================ */}
      {/* BACKGROUND LAYER: GHOST YEAR & TECHNICAL SVG GUIDES         */}
      {/* ============================================================ */}

      {/* Large Editorial Ghost Year Typography */}
      <motion.span
        style={{
          y: ghostY,
          opacity: ghostOpacity,
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(6rem,17vw,22rem)] font-black text-[#D7E2EA] opacity-[0.035] font-['Kanit',sans-serif] leading-none tracking-tighter pointer-events-none select-none z-0"
      >
        {startYear}
      </motion.span>

      {/* Technical Background Line Drawing connected to timeline axis */}
      <motion.svg
        style={{ y: techSvgY, x: techSvgX }}
        className="hidden md:block absolute inset-0 w-full h-full stroke-[#D7E2EA] fill-none pointer-events-none z-0"
        strokeWidth="0.75"
      >
          {/* Horizontal line extending from central timeline outward */}
          <line
            x1="50%"
            y1="50%"
            x2={index % 2 === 0 ? '72%' : '28%'}
            y2="50%"
            strokeDasharray="3 3"
            opacity="0.05"
          />
          <circle
            cx={index % 2 === 0 ? '72%' : '28%'}
            cy="50%"
            r="2"
            className="fill-[#D7E2EA]/20 stroke-none"
          />
          <line
            x1={index % 2 === 0 ? '72%' : '28%'}
            y1="50%"
            x2={index % 2 === 0 ? '72%' : '28%'}
            y2="75%"
            strokeDasharray="2 3"
            opacity="0.04"
          />
        </motion.svg>

      {/* ------------------------------------------------------------ */}
      {/* MOBILE COMPOSITION (< MD SCREENS)                            */}
      {/* ------------------------------------------------------------ */}
      <div className="md:hidden flex flex-col pl-14 pr-4 w-full relative z-10">
        {/* Mobile Left Timeline Node */}
        <div className="absolute left-6 top-2 -translate-x-1/2 flex items-center justify-center">
          <motion.div
            style={{ scale: nodeScale }}
            className="w-3.5 h-3.5 rounded-full bg-[#0C0C0C] border-2 border-[#BBCCD7] shadow-[0_0_10px_rgba(187,204,215,0.5)]"
          />
        </div>


        {/* Number & Period */}
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-black text-[#D7E2EA] text-2xl sm:text-3xl leading-none select-none">
            {item.number}
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-[#D7E2EA]/60">
            {item.period}
          </span>
        </div>

        {/* Company Name */}
        <h3 className="text-xl sm:text-2xl font-black uppercase text-[#D7E2EA] tracking-wide mb-1">
          {item.company}
        </h3>

        {/* Mobile Connector Line */}
        <motion.div
          style={{ scaleX: connectorScaleX, opacity: connectorOpacity }}
          className="w-16 h-[1px] bg-[#BBCCD7]/50 my-2 origin-left"
        />

        {/* Role & Detail */}
        <h4 className="text-sm sm:text-base font-bold uppercase text-[#D7E2EA]/90">
          {item.role}
        </h4>
        {item.detail && (
          <span className="text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/50 mt-0.5 block">
            DETAIL: {item.detail}
          </span>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-xs sm:text-sm font-light text-[#D7E2EA]/75 leading-relaxed mt-2.5 max-w-sm">
            {item.description}
          </p>
        )}

        {/* Tharun Speaks Editorial Monochromatic Stats */}
        {item.stats && item.stats.length > 0 && (
          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-[#D7E2EA]/15">
            {item.stats.map((st) => (
              <div key={st.label} className="flex flex-col">
                <span className="text-xl font-black text-[#D7E2EA]">{st.value}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D7E2EA]/50 mt-0.5">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* DESKTOP ASYMMETRICAL EDITORIAL SPLIT (>= MD SCREENS)          */}
      {/* ------------------------------------------------------------ */}

      {/* DESKTOP LEFT SIDE: Number, Company, Period */}
      <div className="hidden md:flex flex-col items-end text-right w-1/2 pr-14 lg:pr-16 z-10">
        <span className="font-black text-[#D7E2EA] text-[clamp(2.5rem,5.2vw,68px)] leading-none select-none mb-1">
          {item.number}
        </span>
        <h3 className="text-2xl lg:text-3xl font-black uppercase text-[#D7E2EA] tracking-wide">
          {item.company}
        </h3>
        <span className="text-xs lg:text-sm font-mono uppercase tracking-widest text-[#D7E2EA]/60 mt-1">
          {item.period}
        </span>
      </div>

      {/* DESKTOP CENTER: Active Node & Horizontal Technical Connector */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20">
        {/* Active Node Circle */}
        <motion.div
          style={{ scale: nodeScale }}
          className="w-4 h-4 rounded-full bg-[#0C0C0C] border-2 border-[#BBCCD7] shadow-[0_0_12px_rgba(187,204,215,0.6)]"
        />

        {/* Dynamic Growing Horizontal Technical Connector (70px - 100px) */}
        <motion.div
          style={{ scaleX: connectorScaleX, opacity: connectorOpacity }}
          className="absolute left-2 w-16 lg:w-20 h-[1px] bg-gradient-to-r from-[#BBCCD7] to-transparent origin-left pointer-events-none"
        />
      </div>

      {/* DESKTOP RIGHT SIDE: Role, Detail, Description, Factual Stats */}
      <div className="hidden md:flex flex-col items-start text-left w-1/2 pl-14 lg:pl-16 z-10">
        <h4 className="text-xl lg:text-2xl font-bold uppercase text-[#D7E2EA] tracking-wide">
          {item.role}
        </h4>

        {item.detail && (
          <span className="text-xs font-mono uppercase tracking-widest text-[#D7E2EA]/50 mt-1">
            DETAIL: {item.detail}
          </span>
        )}

        {item.description && (
          <p className="text-sm font-light text-[#D7E2EA]/75 leading-relaxed max-w-md mt-2.5">
            {item.description}
          </p>
        )}

        {/* Tharun Speaks Editorial Monochromatic Stats & Scope List */}
        {item.stats && item.stats.length > 0 && (
          <div className="flex flex-col gap-4 mt-5 pt-4 border-t border-[#D7E2EA]/15 w-full max-w-md">
            <div className="flex items-center gap-10">
              {item.stats.map((st) => (
                <div key={st.label} className="flex flex-col">
                  <span className="text-2xl lg:text-3xl font-black text-[#D7E2EA]">
                    {st.value}
                  </span>
                  <span className="text-[10px] lg:text-xs font-mono uppercase tracking-widest text-[#D7E2EA]/50 mt-0.5">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Scope Responsibilities List separated by slashes */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-[#D7E2EA]/50 tracking-wider">
              {tharunResponsibilities.map((resp, i) => (
                <React.Fragment key={resp}>
                  <span>{resp}</span>
                  {i < tharunResponsibilities.length - 1 && <span className="opacity-40">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExperienceSection;
