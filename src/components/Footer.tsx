import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#121110]/10 py-8 px-6 md:px-12 max-w-[1400px] mx-auto bg-[#F8F7F3]">
      <div className="flex items-center justify-between gap-4 text-xs text-[#706B65]">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-[#121110]">ANNIE</span>
          <span aria-hidden="true" className="text-[#121110]/20">·</span>
          <span>Graphic Designer</span>
        </div>
        <div className="font-mono text-[11px] tracking-widest text-[#8A847C] uppercase">
          © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
