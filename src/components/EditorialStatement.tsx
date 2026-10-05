import React, { useEffect, useRef } from 'react';

export const EditorialStatement: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const orbitingBallRef = useRef<HTMLDivElement>(null);

  // Smooth continuous rounded-perimeter orbit loop for the larger copper ball
  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;
    const speed = 160; // constant speed in pixels per second

    const animateBall = (timestamp: number) => {
      if (!cardRef.current || !orbitingBallRef.current) {
        animId = requestAnimationFrame(animateBall);
        return;
      }

      if (startTime === null) startTime = timestamp;
      const elapsedSeconds = (timestamp - startTime) / 1000;

      // Actual card dimensions
      const w = cardRef.current.offsetWidth;
      const h = cardRef.current.offsetHeight;
      const r = window.innerWidth < 768 ? 20 : 24; // matches rounded-[20px] md:rounded-[24px]

      // Segment lengths along rounded rectangle
      const straightTop = Math.max(0, w - 2 * r);
      const straightSide = Math.max(0, h - 2 * r);
      const cornerArc = (Math.PI / 2) * r;

      const perimeter = 2 * straightTop + 2 * straightSide + 4 * cornerArc;

      if (perimeter > 0) {
        const d = (elapsedSeconds * speed) % perimeter;

        let x = 0;
        let y = 0;

        // 1. Top straight edge (left to right)
        if (d < straightTop) {
          x = r + d;
          y = 0;
        } 
        // 2. Top-right corner arc
        else if (d < straightTop + cornerArc) {
          const delta = d - straightTop;
          const theta = -Math.PI / 2 + delta / r;
          x = w - r + r * Math.cos(theta);
          y = r + r * Math.sin(theta);
        } 
        // 3. Right straight edge (top to bottom)
        else if (d < straightTop + cornerArc + straightSide) {
          const delta = d - (straightTop + cornerArc);
          x = w;
          y = r + delta;
        } 
        // 4. Bottom-right corner arc
        else if (d < straightTop + 2 * cornerArc + straightSide) {
          const delta = d - (straightTop + cornerArc + straightSide);
          const theta = 0 + delta / r;
          x = w - r + r * Math.cos(theta);
          y = h - r + r * Math.sin(theta);
        } 
        // 5. Bottom straight edge (right to left)
        else if (d < 2 * straightTop + 2 * cornerArc + straightSide) {
          const delta = d - (straightTop + 2 * cornerArc + straightSide);
          x = w - r - delta;
          y = h;
        } 
        // 6. Bottom-left corner arc
        else if (d < 2 * straightTop + 3 * cornerArc + straightSide) {
          const delta = d - (2 * straightTop + 2 * cornerArc + straightSide);
          const theta = Math.PI / 2 + delta / r;
          x = r + r * Math.cos(theta);
          y = h - r + r * Math.sin(theta);
        } 
        // 7. Left straight edge (bottom to top)
        else if (d < 2 * straightTop + 3 * cornerArc + 2 * straightSide) {
          const delta = d - (2 * straightTop + 3 * cornerArc + 2 * straightSide);
          x = 0;
          y = h - r - delta;
        } 
        // 8. Top-left corner arc
        else {
          const delta = d - (2 * straightTop + 3 * cornerArc + 2 * straightSide);
          const theta = Math.PI + delta / r;
          x = r + r * Math.cos(theta);
          y = r + r * Math.sin(theta);
        }

        // Position the center of the ball exactly on the card border
        orbitingBallRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(animateBall);
    };

    animId = requestAnimationFrame(animateBall);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section 
      id="editorial-intro"
      className="relative w-full min-h-[100svh] flex items-center justify-center py-20 sm:py-28 md:py-36 px-4 min-[375px]:px-6 sm:px-10 md:px-14 lg:px-16 max-w-[1400px] mx-auto bg-[#000000] text-[#F8F7F3] select-none"
    >
      {/* ========================================================================= */}
      {/* LARGE SUBSTANTIAL PREMIUM TEXT CARD AS MAIN VISUAL CENTERPIECE            */}
      {/* ========================================================================= */}
      <div className="relative w-full flex items-center justify-center">
        
        <div 
          ref={cardRef}
          className="relative w-full max-w-4xl lg:max-w-5xl xl:max-w-[1140px] min-h-[440px] sm:min-h-[500px] md:min-h-[540px] flex flex-col justify-center border-[1.5px] border-[#F8F7F3]/30 rounded-[20px] md:rounded-[24px] p-8 min-[375px]:p-10 sm:p-14 md:p-20 lg:p-24 bg-transparent z-10"
        >
          {/* ===================================================================== */}
          {/* SOFT INTERNAL 3D ILLUMINATION & TACTILE DEPTH (NO GENERIC GLASSMORPHISM) */}
          {/* ===================================================================== */}
          <div 
            className="absolute inset-0 rounded-[20px] md:rounded-[24px] pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            {/* Soft central light source radiating behind the typography */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_40%,rgba(248,247,243,0.08),transparent_70%)]" />

            {/* Subtle top-left light highlight and perimeter depth */}
            <div className="absolute inset-0 rounded-[20px] md:rounded-[24px] shadow-[inset_0_1.5px_2px_rgba(248,247,243,0.18),inset_0_-1.5px_2px_rgba(0,0,0,0.35)]" />

            {/* Subtle layered inner contour plate */}
            <div className="absolute inset-2 sm:inset-3 rounded-[14px] md:rounded-[18px] border border-[#F8F7F3]/[0.06]" />
          </div>

          {/* ===================================================================== */}
          {/* THE SINGLE LARGER CONTINUOUSLY ORBITING COPPER BALL (~2× ORIGINAL SIZE)*/}
          {/* ===================================================================== */}
          <div 
            ref={orbitingBallRef}
            className="absolute top-0 left-0 w-5 h-5 rounded-full bg-[#C87A54] pointer-events-none will-change-transform z-30 shadow-[0_0_14px_rgba(200,122,84,0.5)]"
            style={{ transform: 'translate3d(0, 0, 0) translate(-50%, -50%)' }}
            aria-hidden="true"
          />

          {/* ===================================================================== */}
          {/* STRICTLY NON-ITALIC ROMAN TYPOGRAPHY WITH BREATHING ROOM              */}
          {/* ===================================================================== */}
          <div className="space-y-8 sm:space-y-10 md:space-y-12 relative z-10">
            
            {/* HEADING (NON-ITALIC) */}
            <h2 className="font-serif not-italic text-5xl min-[360px]:text-[3.25rem] min-[430px]:text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] text-[#F8F7F3] leading-[1.02] tracking-[-0.03em] m-0 p-0 font-normal">
              Hi, I'm Annie.
            </h2>

            {/* DESCRIPTION (NON-ITALIC) */}
            <p className="text-xl min-[360px]:text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.25rem] font-sans not-italic font-normal text-[#CBC5D1] leading-[1.4] tracking-tight m-0 max-w-3xl">
              I'm a graphic designer creating visual identities and social media designs.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
};
