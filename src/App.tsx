/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EditorialStatement } from './components/EditorialStatement';
import { EditorialNotice } from './components/EditorialNotice';
import { Footer } from './components/Footer';

export default function App() {
  const [activeModal, setActiveModal] = useState<'work' | 'about' | 'contact' | null>(null);

  const handleNavClick = (section: 'work' | 'about' | 'contact') => {
    if (section === 'work' || section === 'about') {
      const nextSection = document.getElementById('editorial-intro');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setActiveModal(section);
  };

  const handleViewWork = () => {
    const nextSection = document.getElementById('editorial-intro');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#000000] text-[#F4F0EA] selection:bg-[#F4F0EA] selection:text-[#000000]">
      <div>
        <Navbar onNavClick={handleNavClick} />
        <main>
          <Hero onViewWork={handleViewWork} />
          <EditorialStatement />
        </main>
      </div>

      <Footer />

      <EditorialNotice 
        type={activeModal} 
        onClose={() => setActiveModal(null)} 
      />
    </div>
  );
}
