import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import ContactButton from '../components/ContactButton';
import ResumeButton from '../components/ResumeButton';
import Magnet from '../components/Magnet';
import TypewriterTagline from '../components/TypewriterTagline';
import heroImage from '../assets/heroImage/heroImage.png';
import { profileData } from '../data/profile';
import { useContactMenu } from '../components/ContactMenu';

const NAV_ITEMS = [
  { label: 'About', target: 'about' },
  { label: 'Services', target: 'price' },
  { label: 'Projects', target: 'projects' },
  { label: 'Contact', target: 'contact' },
];

export const HeroSection: React.FC = () => {
  const { toggleMenu, isTriggerActive } = useContactMenu();
  const navContactRef = useRef<HTMLButtonElement>(null);

  const handleNavClick = (target: string) => {
    if (target === 'contact') {
      if (navContactRef.current) {
        toggleMenu(navContactRef.current, 'bottom', 'nav-contact');
      }
      return;
    }
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-x-clip bg-[#0C0C0C]">
      {/* 1. Header Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 z-20"
      >
        {NAV_ITEMS.map((item) => {
          const isContact = item.target === 'contact';
          return (
            <button
              key={item.label}
              ref={isContact ? navContactRef : undefined}
              onClick={() => handleNavClick(item.target)}
              aria-label={isContact ? 'Contact options' : undefined}
              aria-expanded={isContact ? isTriggerActive('nav-contact') : undefined}
              aria-haspopup={isContact ? 'true' : undefined}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-0 select-none focus-visible:outline-2 focus-visible:outline-[#D7E2EA] focus-visible:outline-offset-2 rounded-sm"
            >
              {item.label}
            </button>
          );
        })}
      </motion.nav>

      {/* 2. Massive Hero Heading */}
      <div className="w-full overflow-hidden mt-6 sm:mt-4 md:-mt-5 z-0 flex justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] select-none"
        >
          HI, I&apos;M TIRTH
        </motion.h1>
      </div>

      {/* 3. Centered Magnetic Hero Portrait Visual */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute left-1/2 -translate-x-1/2 z-10 top-[calc(50%+35px)] -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
      >
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
        >
          <img
            src={heroImage}
            alt="3D Creator Portrait Visual"
            className="w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] object-contain pointer-events-none select-none drop-shadow-2xl"
          />
        </Magnet>
      </motion.div>

      {/* 4. Bottom Information Bar & CTAs */}
      <div className="w-full flex flex-wrap sm:flex-nowrap justify-between items-end gap-y-4 px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 z-20">
        {/* Left Tagline: Polish typewriter effect with zero layout shifts */}
        <TypewriterTagline texts={profileData.taglines ?? [profileData.tagline]} />

        {/* Action Buttons: Resume & Contact Me */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end shrink-0"
        >
          <ResumeButton
            href={profileData.resumeUrl || '/resume.html'}
          />
          <ContactButton
            placement="top"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
