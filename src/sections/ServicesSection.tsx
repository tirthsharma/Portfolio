import React from 'react';
import FadeIn from '../components/FadeIn';
import { servicesData } from '../data/services';

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="price"
      className="relative w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-0"
    >
      {/* Anchor for Services link */}
      <div id="services" className="absolute top-0 left-0" />

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <FadeIn delay={0} y={40} className="mb-16 sm:mb-20 md:mb-28 text-center">
          <h2 className="font-black uppercase tracking-tight text-[#0C0C0C] leading-none text-[clamp(3rem,12vw,160px)]">
            Services
          </h2>
        </FadeIn>

        {/* 5 Vertical Numbered Service Items */}
        <div className="w-full flex flex-col divide-y divide-[#0C0C0C]/15 border-y border-[#0C0C0C]/15">
          {servicesData.map((service, index) => (
            <FadeIn
              key={service.id}
              delay={index * 0.1}
              y={30}
              className="w-full py-8 sm:py-10 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8"
            >
              {/* Number */}
              <div className="font-black text-[#0C0C0C] leading-none text-[clamp(3rem,10vw,140px)] min-w-[120px] sm:min-w-[160px] select-none">
                {service.number}
              </div>

              {/* Stacked Name & Description */}
              <div className="flex flex-col gap-2 max-w-2xl flex-1">
                <h3 className="font-medium uppercase text-[#0C0C0C] text-[clamp(1rem,2.2vw,2.1rem)] tracking-normal">
                  {service.title}
                </h3>
                <p className="font-light text-[#0C0C0C] opacity-60 leading-relaxed text-[clamp(0.85rem,1.6vw,1.25rem)]">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
