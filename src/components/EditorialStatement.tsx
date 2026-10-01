import React from 'react';

export const EditorialStatement: React.FC = () => {
  return (
    <section 
      id="editorial-intro"
      className="relative w-full min-h-[85svh] flex flex-col justify-center py-24 sm:py-32 md:py-40 px-6 min-[375px]:px-8 sm:px-12 md:px-16 max-w-[1400px] mx-auto bg-[#000000] text-[#F4F0EA] border-t border-[#F4F0EA]/10 select-none"
    >
      {/* Editorial Marker & Heading */}
      <div className="mb-10 sm:mb-14">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#A69FAE]">
          [ 01 / PROFILE ]
        </span>
        <h2 className="font-display font-extrabold text-4xl min-[360px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.035em] text-[#F4F0EA] uppercase mt-3">
          ANNIE
        </h2>
      </div>

      {/* Editorial Statement */}
      <div className="max-w-3xl space-y-6 sm:space-y-8">
        <p className="font-serif italic text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl text-[#F4F0EA] leading-tight">
          Hi, I'm Annie.
        </p>
        <p className="text-lg min-[360px]:text-xl sm:text-2xl md:text-3xl font-light text-[#CBC5D1] leading-relaxed tracking-tight">
          I'm a graphic designer focused on creating visual identities, social media designs and creative digital experiences.
        </p>
      </div>

      {/* Quiet Editorial Focus Areas */}
      <div className="mt-16 sm:mt-24 pt-8 border-t border-[#F4F0EA]/10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-xs font-mono tracking-wider text-[#A69FAE] uppercase">
        <div>
          <span className="text-[#F4F0EA] block mb-1">01. Visual Identity</span>
          <span className="text-[#8E8A94]">Logomarks, Typography &amp; Systems</span>
        </div>
        <div>
          <span className="text-[#F4F0EA] block mb-1">02. Social Architecture</span>
          <span className="text-[#8E8A94]">Editorial Feeds &amp; Content Formats</span>
        </div>
        <div>
          <span className="text-[#F4F0EA] block mb-1">03. Digital Experiences</span>
          <span className="text-[#8E8A94]">Art Direction &amp; Interactive Spaces</span>
        </div>
      </div>
    </section>
  );
};
