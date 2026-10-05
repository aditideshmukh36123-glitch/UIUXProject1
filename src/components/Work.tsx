import React, { useState } from 'react';

export interface PosterProject {
  id: string;
  number: string;
  category: string;
  title: string;
  filename: string; // Filename located directly in project root (alongside package.json)
  alt: string;
}

// ============================================================================
// ROOT-LEVEL POSTER CONFIGURATION
// Place your image files directly in the project root directory (alongside package.json)
// To add, remove, or rename posters, edit this list:
// ============================================================================
export const POSTER_PROJECTS: PosterProject[] = [
  {
    id: 'poster-01',
    number: '01',
    category: 'POSTER DESIGN',
    title: 'Poster Design 01',
    filename: 'Poster-01.png',
    alt: 'Poster Design 01 by Annie',
  },
  {
    id: 'poster-02',
    number: '02',
    category: 'SOCIAL MEDIA DESIGN',
    title: 'Social Media Design 02',
    filename: 'Poster-02.png',
    alt: 'Social Media Design 02 by Annie',
  },
  {
    id: 'poster-03',
    number: '03',
    category: 'BRAND IDENTITY',
    title: 'Brand Identity 03',
    filename: 'Poster-03.png',
    alt: 'Brand Identity 03 by Annie',
  },
  {
    id: 'poster-04',
    number: '04',
    category: 'CREATIVE CAMPAIGN',
    title: 'Creative Campaign 04',
    filename: 'Poster-01.png',
    alt: 'Creative Campaign 04 by Annie',
  },
  {
    id: 'poster-05',
    number: '05',
    category: 'EDITORIAL DESIGN',
    title: 'Editorial Design 05',
    filename: 'Poster-05.png',
    alt: 'Editorial Design 05 by Annie',
  },
];

interface PosterCardProps {
  project: PosterProject;
  index: number;
}

const PosterCard: React.FC<PosterCardProps> = ({ project, index }) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // In Vite dev server, root-level files (alongside package.json) are served at /<filename>
  const imageSrc = project.filename.startsWith('/')
    ? project.filename
    : `/${project.filename}`;

  return (
    <div
      className={`group relative w-full flex flex-col ${
        index % 2 === 1 ? 'md:mt-12 lg:mt-16' : ''
      }`}
    >
      {/* PREMIUM ART-DIRECTED POSTER CARD */}
      <div className="relative w-full rounded-xl sm:rounded-2xl border border-[#F8F7F3]/20 bg-transparent p-3 sm:p-5 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-[#F8F7F3]/40 group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.55)]">
        
        {/* POSTER ARTWORK CONTAINER */}
        <div className="relative w-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px] overflow-hidden rounded-lg bg-[#0E0D0C] border border-[#F8F7F3]/5 flex items-center justify-center p-2 sm:p-4">
          
          {/* ROOT-LEVEL POSTER IMAGE */}
          <img
            src={imageSrc}
            alt={project.alt}
            loading="lazy"
            onLoad={() => {
              setHasLoaded(true);
              setHasError(false);
            }}
            onError={() => {
              setHasError(true);
              setHasLoaded(false);
            }}
            className={`w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03] will-change-transform select-none ${
              hasLoaded && !hasError ? 'block' : 'hidden'
            }`}
          />

          {/* READY STATE (Awaiting your file in the project root alongside package.json) */}
          {(!hasLoaded || hasError) && (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <span className="w-10 h-10 rounded-full border border-[#C87A54]/30 flex items-center justify-center text-[#C87A54] font-mono text-xs">
                {project.number}
              </span>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#F8F7F3]/80 uppercase tracking-widest">
                  {project.filename}
                </p>
                <p className="font-mono text-[11px] text-[#8E8A94] tracking-wide">
                  Place in <span className="text-[#C87A54]">project root /</span> alongside package.json
                </p>
              </div>
            </div>
          )}

        </div>

        {/* MINIMAL CARD META: NUMBER & CATEGORY */}
        <div className="mt-4 sm:mt-5 pt-3.5 flex items-center justify-between border-t border-[#F8F7F3]/10">
          <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1.5">
            <span className="font-mono text-xs sm:text-sm text-[#C87A54] tracking-widest font-medium">
              {project.number}
            </span>
            <span className="text-[#8E8A94] text-xs sm:text-sm font-mono tracking-wider uppercase">
              — {project.category}
            </span>
          </div>

          <span className="font-mono text-[10px] text-[#8E8A94]/60 uppercase tracking-widest transition-opacity duration-300 group-hover:text-[#F8F7F3]">
            [ 0{index + 1} ]
          </span>
        </div>

      </div>
    </div>
  );
};

export const Work: React.FC = () => {
  return (
    <section
      id="work-section"
      className="relative w-full min-h-[100svh] py-24 sm:py-32 md:py-44 px-6 min-[375px]:px-8 sm:px-12 md:px-16 max-w-[1400px] mx-auto bg-[#000000] text-[#F8F7F3] select-none"
    >
      {/* ========================================================================= */}
      {/* SECTION INTRO: ONLY THE WORD "WORK" (STRONG TYPOGRAPHY & NEGATIVE SPACE)   */}
      {/* ========================================================================= */}
      <div className="pb-4 mb-14 sm:mb-20 md:mb-28">
        <h2 className="font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[-0.04em] uppercase text-[#F8F7F3] m-0 p-0">
          WORK
        </h2>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN ART-DIRECTED POSTER GRID (DESKTOP) / 1-COLUMN (MOBILE)           */}
      {/* Preserves each poster's natural aspect ratio without cropping             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start">
        {POSTER_PROJECTS.map((project, index) => (
          <PosterCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
