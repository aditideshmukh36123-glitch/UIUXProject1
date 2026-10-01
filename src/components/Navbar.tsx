import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavClick: (section: 'work' | 'about' | 'contact') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (section: 'work' | 'about' | 'contact') => {
    onNavClick(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-40 w-full bg-transparent transition-all">
      <div className="max-w-[1400px] mx-auto px-6 min-[375px]:px-8 sm:px-12 h-16 md:h-20 flex items-center justify-between">
        {/* Brand: ANNIE */}
        <a 
          href="#" 
          className="font-display font-extrabold text-xl tracking-tight text-[#F4F0EA] hover:text-[#B8A9C2] transition-colors"
        >
          ANNIE
        </a>

        {/* Minimal small navigation: Work, About, Contact */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-[0.22em] text-[#A69FAE]">
          <button
            onClick={() => handleLinkClick('work')}
            className="hover:text-[#F4F0EA] transition-colors py-1 cursor-pointer"
          >
            Work
          </button>
          <button
            onClick={() => handleLinkClick('about')}
            className="hover:text-[#F4F0EA] transition-colors py-1 cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => handleLinkClick('contact')}
            className="hover:text-[#F4F0EA] transition-colors py-1 cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#F4F0EA] hover:text-[#B8A9C2] focus-visible:outline-none cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#F4F0EA]/10 bg-[#161518]/95 backdrop-blur-md px-6 py-6 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col text-base font-display font-bold uppercase tracking-wider text-[#F4F0EA]">
            <button
              onClick={() => handleLinkClick('work')}
              className="text-left py-2.5 min-h-[44px] flex items-center hover:text-[#B8A9C2] transition-colors cursor-pointer"
            >
              Work
            </button>
            <button
              onClick={() => handleLinkClick('about')}
              className="text-left py-2.5 min-h-[44px] flex items-center hover:text-[#B8A9C2] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => handleLinkClick('contact')}
              className="text-left py-2.5 min-h-[44px] flex items-center hover:text-[#B8A9C2] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
