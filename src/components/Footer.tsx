import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#F4F0EA]/10 py-8 px-6 md:px-12 max-w-[1400px] mx-auto bg-[#000000]">
      <div className="flex items-center justify-between gap-4 text-xs text-[#A69FAE]">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-[#F4F0EA]">ANNIE</span>
          <span aria-hidden="true" className="text-[#F4F0EA]/20">·</span>
          <span>Graphic Designer</span>
        </div>
      </div>
    </footer>
  );
};
