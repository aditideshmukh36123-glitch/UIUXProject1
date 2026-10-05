import React, { useEffect, useRef } from 'react';

interface HeroProps {
  onViewWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewWork }) => {
  const containerRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Position and state references (no React re-renders during 60fps tracking)
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const radiusRef = useRef(80);
  const hasUserInteracted = useRef(false);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const circle = circleRef.current;
    if (!container || !circle) return;

    // Fluid responsive spotlight radius: tailored to cover AN + half of second N and Graphic Designer
    const computeFluidRadius = () => {
      const width = window.innerWidth;

      if (width < 360) {
        // Compact phones (320px): slightly larger on mobile (~168px diameter)
        return 84;
      } else if (width < 450) {
        // Standard to large phones (360px - 430px): slightly larger on mobile (184px - 212px diameter)
        return Math.round(92 + ((width - 360) / 90) * 14);
      } else if (width < 768) {
        // Phablets & small tablets: slightly adjusted mobile/phablet range
        return Math.round(112 + ((width - 450) / 318) * 24);
      } else if (width < 1024) {
        // Tablets & small laptops: 240px - 296px diameter (UNTOUCHED)
        return Math.round(120 + ((width - 768) / 256) * 28);
      } else if (width < 1440) {
        // Laptops (1024px - 1440px): 300px - 372px diameter, balanced with ANNIE typography (UNTOUCHED)
        return Math.round(150 + ((width - 1024) / 416) * 36);
      } else {
        // Large desktops (1440px+): 380px - 430px diameter (UNTOUCHED)
        return Math.min(215, Math.round(190 + ((width - 1440) / 480) * 22));
      }
    };

    const updateSize = () => {
      const r = computeFluidRadius();
      radiusRef.current = r;
      circle.style.width = `${r * 2}px`;
      circle.style.height = `${r * 2}px`;
    };

    updateSize();

    // Responsive default initial position:
    // Positioned so the reveal area covers approximately "AN" and half of the second "N" in ANNIE,
    // and extends downward to reveal part of Graphic Designer.
    const computeDefaultPosition = () => {
      if (!textRef.current || !subtitleRef.current) {
        return { x: 120, y: 180 };
      }

      const textRect = textRef.current.getBoundingClientRect();
      const width = window.innerWidth;
      const isMobile = width < 768;

      // In viewport coordinates (since circle is fixed)
      const initialX = textRect.left + textRect.width * 0.22;
      const initialY = textRect.top + textRect.height * (isMobile ? 0.68 : 0.64);

      return { x: initialX, y: initialY };
    };

    // Apply initial default position immediately (no jump, no delay)
    const defPos = computeDefaultPosition();
    targetPos.current = { x: defPos.x, y: defPos.y };
    currentPos.current = { x: defPos.x, y: defPos.y };
    const initialR = radiusRef.current;
    circle.style.transform = `translate3d(${(defPos.x - initialR).toFixed(1)}px, ${(defPos.y - initialR).toFixed(1)}px, 0)`;

    // Refine default position once custom fonts are loaded (if user hasn't moved pointer yet)
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        if (!hasUserInteracted.current && circleRef.current && textRef.current) {
          const refined = computeDefaultPosition();
          targetPos.current = { x: refined.x, y: refined.y };
          currentPos.current = { x: refined.x, y: refined.y };
          const curR = radiusRef.current;
          circleRef.current.style.transform = `translate3d(${(refined.x - curR).toFixed(1)}px, ${(refined.y - curR).toFixed(1)}px, 0)`;
        }
      });
    }

    // Passive scroll listener for smooth cinematic transition into the second section
    const onScroll = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight || 800;
      // Scroll progress from 0 (top of hero) down into the second section (reaches 1.0 when fully scrolled into intro)
      const progress = Math.min(1, Math.max(0, (sy - 10) / (vh * 0.85)));
      scrollProgressRef.current = progress;
    };

    // 60-120fps GPU animation loop with fluid easing and scroll expansion
    let animId: number;
    const animate = () => {
      const sp = scrollProgressRef.current;
      const vh = window.innerHeight || 800;
      const vw = window.innerWidth || 1200;

      if (sp > 0.005) {
        // As user scrolls or clicks "View Work":
        // The EXACT SAME circle continues smoothly from the hero into the second section,
        // and expands outward to reveal the warm off-white background and invert typography
        const centerX = vw * 0.42;
        const centerY = vh * 0.46;

        // Smoothly blend pointer target toward center of second section
        const effTargetX = targetPos.current.x * (1 - sp) + centerX * sp;
        const effTargetY = targetPos.current.y * (1 - sp) + centerY * sp;

        currentPos.current.x += (effTargetX - currentPos.current.x) * 0.22;
        currentPos.current.y += (effTargetY - currentPos.current.y) * 0.22;

        const baseR = radiusRef.current;
        const maxScale = (Math.hypot(vw, vh) * 1.1) / (baseR * 2);

        // Progressively expand outward as scrolling continues
        const expansionFactor = Math.pow(sp, 1.25);
        const currentScale = 1 + (maxScale - 1) * expansionFactor;

        const x = currentPos.current.x - baseR;
        const y = currentPos.current.y - baseR;

        circle.style.borderRadius = '50%';
        circle.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${currentScale.toFixed(3)})`;
        circle.style.opacity = '1';
      } else {
        // Standard interactive spotlight behavior at top of hero:
        // Follows user pointer/touch smoothly with GPU acceleration
        circle.style.borderRadius = '50%';
        circle.style.opacity = '1';

        const dx = targetPos.current.x - currentPos.current.x;
        const dy = targetPos.current.y - currentPos.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0.05) {
          const lerpFactor = 0.22;
          currentPos.current.x += dx * lerpFactor;
          currentPos.current.y += dy * lerpFactor;

          const curR = radiusRef.current;
          const x = currentPos.current.x - curR;
          const y = currentPos.current.y - curR;

          circle.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Global and container pointer handlers (in viewport coordinates for fixed spotlight)
    const handlePointerUpdate = (clientX: number, clientY: number) => {
      hasUserInteracted.current = true;
      targetPos.current.x = clientX;
      targetPos.current.y = clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      handlePointerUpdate(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      handlePointerUpdate(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onResize = () => {
      updateSize();
      if (!hasUserInteracted.current) {
        const recomputed = computeDefaultPosition();
        targetPos.current = recomputed;
        currentPos.current = recomputed;
        const curR = radiusRef.current;
        if (circleRef.current) {
          circleRef.current.style.transform = `translate3d(${(recomputed.x - curR).toFixed(1)}px, ${(recomputed.y - curR).toFixed(1)}px, 0)`;
        }
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // React synthetic event handlers to ensure 100% responsiveness in all iframe environments
  const handlePointer = (e: React.PointerEvent) => {
    hasUserInteracted.current = true;
    targetPos.current.x = e.clientX;
    targetPos.current.y = e.clientY;
  };

  const handleTouch = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    hasUserInteracted.current = true;
    targetPos.current.x = e.touches[0].clientX;
    targetPos.current.y = e.touches[0].clientY;
  };

  return (
    <section 
      ref={containerRef}
      onPointerMove={handlePointer}
      onPointerDown={handlePointer}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      className="relative w-full h-[100svh] min-h-[560px] flex flex-col justify-center pb-16 min-[375px]:pb-20 sm:pb-24 select-none bg-[#000000] cursor-default"
      style={{ touchAction: 'pan-y' }}
    >
      {/* THE SINGLE, ORIGINAL GPU-ACCELERATED SPOTLIGHT (mix-blend-difference, fixed across sections) */}
      <div 
        ref={circleRef}
        className="fixed top-0 left-0 rounded-full bg-[#F8F7F3] pointer-events-none mix-blend-difference will-change-transform z-30"
        style={{
          width: '160px',
          height: '160px',
          transform: 'translate3d(-500px, -500px, 0)',
        }}
        aria-hidden="true"
      />

      {/* BASE TYPOGRAPHY CONTENT (pointer-events-none so cursor moves freely across letters) */}
      <div 
        ref={heroContentRef}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 min-[375px]:px-8 sm:px-12 md:px-16 pt-16 sm:pt-20 transition-opacity duration-150 pointer-events-none"
      >
        <div className="flex flex-col items-start max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-none">
          
          {/* ANNIE - Dominant typography (subtly increased by 10-15% on mobile breakpoints) */}
          <h1 
            ref={textRef}
            className="font-display font-extrabold text-[3.1rem] min-[360px]:text-[3.65rem] min-[390px]:text-[4.2rem] min-[430px]:text-[4.75rem] sm:text-6xl md:text-7xl lg:text-[clamp(6.5rem,9.5vw,9rem)] xl:text-[clamp(8.5rem,11.5vw,11.5rem)] tracking-[-0.03em] lg:tracking-[-0.035em] leading-[0.92] lg:leading-[0.88] text-[#F4F0EA] uppercase m-0 p-0"
          >
            ANNIE
          </h1>

          {/* Graphic Designer */}
          <p 
            ref={subtitleRef}
            className="font-serif italic text-lg min-[360px]:text-xl sm:text-2xl md:text-[28px] lg:text-[32px] text-[#F4F0EA]/85 font-normal mt-2 min-[360px]:mt-2.5 sm:mt-3.5 tracking-tight pl-0.5"
          >
            Graphic Designer
          </p>

          {/* View Work (Moved slightly lower on mobile with increased top spacing) */}
          <div className="mt-20 min-[360px]:mt-24 min-[390px]:mt-28 sm:mt-24 md:mt-28 pl-0.5 relative z-40 pointer-events-auto">
            <button
              onClick={onViewWork}
              className="group inline-flex items-center gap-2.5 text-xs min-[390px]:text-[13px] uppercase tracking-[0.22em] font-medium text-[#F4F0EA] hover:opacity-75 border-b border-[#F4F0EA]/30 pb-1 transition-opacity cursor-pointer min-h-[44px]"
            >
              <span>View Work</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1 font-serif text-sm">
                →
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
