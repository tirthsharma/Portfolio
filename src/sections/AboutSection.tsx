import React from 'react';
import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import Magnet from '../components/Magnet';
import { ABOUT_DECORATIVE_ASSETS } from '../data/assets';
import { profileData } from '../data/profile';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden"
    >
      {/* Four Decorative 3D Corner Assets with organic cursor response & mobile floating */}
      {ABOUT_DECORATIVE_ASSETS.map((asset) => (
        <div
          key={asset.id}
          className={`absolute pointer-events-none select-none z-0 opacity-40 sm:opacity-100 ${asset.positionClass} ${asset.widthClass}`}
        >
          <FadeIn
            delay={asset.delay}
            duration={0.9}
            x={asset.initialX}
            y={asset.initialY}
          >
            <Magnet
              padding={asset.magnetConfig?.padding ?? 300}
              strength={asset.magnetConfig?.strength ?? 6}
              maxDistance={asset.magnetConfig?.maxDistance ?? 25}
              damping={asset.magnetConfig?.damping ?? 0.10}
              rotateStrength={asset.magnetConfig?.rotateStrength ?? 0}
              floatClassName={asset.magnetConfig?.floatClassName ?? 'about-float-1'}
            >
              <img
                src={asset.url}
                alt={asset.alt}
                className="w-full h-auto object-contain drop-shadow-xl"
              />
            </Magnet>
          </FadeIn>
        </div>
      ))}

      {/* Main Content Stack */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Section Heading */}
        <FadeIn delay={0} y={40} className="mb-10 sm:mb-14 md:mb-16">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)]">
            About me
          </h2>
        </FadeIn>

        {/* Character-by-Character Scroll-Driven Text Reveal */}
        <AnimatedText
          text={profileData.positioning}
          className="mb-16 sm:mb-20 md:mb-24"
        />

        {/* Contact CTA Button */}
        <FadeIn delay={0.2} y={20}>
          <ContactButton
            placement="top"
          />
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutSection;
