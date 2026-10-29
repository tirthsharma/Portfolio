import React, { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import ToolMarquee from '../components/ToolMarquee';

export const ToolsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="tools"
      ref={sectionRef}
      className="relative w-full bg-[#0C0C0C] text-[#D7E2EA] px-4 sm:px-8 md:px-10 py-20 sm:py-24 z-10 overflow-hidden flex flex-col justify-center min-h-[60vh] md:min-h-[70vh]"
    >
      {/* Section Transition Line connecting Experience to Tools */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-80 h-[1px] bg-gradient-to-r from-transparent via-[#D7E2EA]/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col">
        {/* Top Editorial Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12 border-b border-[#D7E2EA]/10 pb-4">
          <FadeIn delay={0} y={20}>
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-[#D7E2EA]/50 block">
              SOFTWARE
            </span>
          </FadeIn>
        </div>

        {/* Section Heading & Copy */}
        <div className="text-center mb-10 sm:mb-14">
          <FadeIn delay={0.1} y={30}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.5rem,8vw,110px)] mb-4">
              TECH STACK
            </h2>
          </FadeIn>

          <FadeIn delay={0.15} y={20}>
            <p className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-widest text-[#D7E2EA]/70 max-w-lg mx-auto">
              TOOLS I USE TO DESIGN, ANIMATE &amp; CREATE.
            </p>
          </FadeIn>
        </div>

        {/* Infinite Tool Marquee Strip */}
        <FadeIn delay={0.2} y={30} className="w-full">
          <ToolMarquee sectionRef={sectionRef} />
        </FadeIn>
      </div>
    </section>
  );
};

export default ToolsSection;
