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
  const morphTextRef = useRef<HTMLDivElement>(null);

  // Position and state references (no React re-renders during 60fps tracking)
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const radiusRef = useRef(68);
  const hasUserInteracted = useRef(false);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const circle = circleRef.current;
    if (!container || !circle) return;

    // Fluid responsive spotlight radius: noticeably larger on mobile, bold and immersive on laptop & desktop
    const computeFluidRadius = () => {
      const width = window.innerWidth;

      if (width < 360) {
        // Compact phones (320px): 148px diameter
        return 74;
      } else if (width < 450) {
        // Standard to large phones (360px - 430px): 160px - 184px diameter
        return Math.round(80 + ((width - 360) / 90) * 12);
      } else if (width < 768) {
        // Phablets & small tablets: 200px - 260px diameter
        return Math.round(100 + ((width - 450) / 318) * 30);
      } else if (width < 1024) {
        // Tablets & small laptops: 240px - 296px diameter
        return Math.round(120 + ((width - 768) / 256) * 28);
      } else if (width < 1440) {
        // Laptops (1024px - 1440px): 300px - 372px diameter, balanced with ANNIE typography
        return Math.round(150 + ((width - 1024) / 416) * 36);
      } else {
        // Large desktops (1440px+): 380px - 430px diameter
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
    // does NOT cover the entire upper part of ANNIE, and extends downward to reveal part of Graphic Designer.
    const computeDefaultPosition = () => {
      if (!containerRef.current || !textRef.current || !subtitleRef.current) {
        return { x: 120, y: 180 };
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const textRect = textRef.current.getBoundingClientRect();
      const width = window.innerWidth;
      const isMobile = width < 768;

      // Horizontal: centered through ~22% of ANNIE's width
      // This illuminates from the start of "A", across "N", through the first half of the second "N",
      // leaving the remaining letters in their normal warm-white appearance.
      const initialX = textRect.left - containerRect.left + textRect.width * 0.22;

      // Vertical: positioned relative to text so the circle does NOT cover the entire upper part of ANNIE,
      // and extends down into "Graphic Designer"
      let initialY: number;
      if (isMobile) {
        initialY = textRect.top - containerRect.top + textRect.height * 0.68;
      } else {
        initialY = textRect.top - containerRect.top + textRect.height * 0.64;
      }

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
        if (!hasUserInteracted.current && containerRef.current && circleRef.current) {
          const refined = computeDefaultPosition();
          targetPos.current = { x: refined.x, y: refined.y };
          currentPos.current = { x: refined.x, y: refined.y };
          const curR = radiusRef.current;
          circleRef.current.style.transform = `translate3d(${(refined.x - curR).toFixed(1)}px, ${(refined.y - curR).toFixed(1)}px, 0)`;
        }
      });
    }

    // Passive scroll listener for smooth cinematic transition into the next section
    const onScroll = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight || 800;
      // Only transition when user explicitly scrolls past top threshold (> 20px)
      const progress = Math.min(1, Math.max(0, (sy - 20) / (vh * 0.7)));
      scrollProgressRef.current = progress;
    };

    // 60-120fps GPU animation loop with fluid easing and scroll morph
    let animId: number;
    const animate = () => {
      const sp = scrollProgressRef.current;

      if (sp > 0.02) {
        // As user scrolls: spotlight gathers toward center, contracts, and morphs into ANNIE
        const containerW = container.clientWidth;
        const containerH = container.clientHeight;
        const centerX = containerW / 2;
        const centerY = containerH * 0.44;

        // Smoothly blend pointer target toward center
        const effTargetX = targetPos.current.x * (1 - sp) + centerX * sp;
        const effTargetY = targetPos.current.y * (1 - sp) + centerY * sp;

        currentPos.current.x += (effTargetX - currentPos.current.x) * 0.24;
        currentPos.current.y += (effTargetY - currentPos.current.y) * 0.24;

        // Contract radius & morph shape
        const scale = Math.max(0.12, 1 - sp * 0.85);
        const baseR = radiusRef.current;
        const curR = baseR * scale;

        // Lose circular shape, gather inward toward typography
        const borderRadius = `${Math.max(12, 50 - sp * 45)}%`;
        circle.style.borderRadius = borderRadius;

        const x = currentPos.current.x - curR;
        const y = currentPos.current.y - curR;

        circle.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        circle.style.opacity = `${Math.max(0, 1 - sp * 1.15).toFixed(2)}`;

        // Fade out original hero text
        if (heroContentRef.current) {
          heroContentRef.current.style.opacity = `${Math.max(0, 1 - sp * 1.9).toFixed(2)}`;
        }

        // Morphing typography blooming from the center of the light
        if (morphTextRef.current) {
          const textOpacity = Math.min(1, Math.max(0, (sp - 0.22) * 2.4));
          morphTextRef.current.style.opacity = textOpacity.toFixed(2);
          morphTextRef.current.style.transform = `translate3d(0, ${((1 - sp) * 20).toFixed(1)}px, 0) scale(${(0.88 + sp * 0.12).toFixed(3)})`;
        }
      } else {
        // Standard interactive spotlight behavior: follows user pointer smoothly
        circle.style.borderRadius = '50%';
        circle.style.opacity = '1';
        if (heroContentRef.current) heroContentRef.current.style.opacity = '1';
        if (morphTextRef.current) morphTextRef.current.style.opacity = '0';

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

    // Global and container pointer handlers for reliable movement tracking
    const handlePointerUpdate = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();
      hasUserInteracted.current = true;
      targetPos.current.x = clientX - cRect.left;
      targetPos.current.y = clientY - cRect.top;
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
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchstart', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchstart', onTouchMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // React synthetic event handlers to ensure 100% responsiveness in all iframe environments
  const handlePointer = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    hasUserInteracted.current = true;
    targetPos.current.x = e.clientX - cRect.left;
    targetPos.current.y = e.clientY - cRect.top;
  };

  const handleTouch = (e: React.TouchEvent) => {
    if (!e.touches[0] || !containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    hasUserInteracted.current = true;
    targetPos.current.x = e.touches[0].clientX - cRect.left;
    targetPos.current.y = e.touches[0].clientY - cRect.top;
  };

  return (
    <section 
      ref={containerRef}
      onPointerMove={handlePointer}
      onPointerDown={handlePointer}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      className="relative w-full h-[100svh] min-h-[560px] flex flex-col justify-center pb-16 min-[375px]:pb-20 sm:pb-24 overflow-hidden select-none bg-[#000000] cursor-default"
      style={{ touchAction: 'pan-y' }}
    >
      {/* GPU-ACCELERATED REVEAL SPOTLIGHT (mix-blend-difference) */}
      <div 
        ref={circleRef}
        className="absolute top-0 left-0 rounded-full bg-[#F4F0EA] pointer-events-none mix-blend-difference will-change-transform z-20"
        style={{
          width: '136px',
          height: '136px',
          transform: 'translate3d(-500px, -500px, 0)',
        }}
        aria-hidden="true"
      />

      {/* CENTRAL MORPH TYPOGRAPHY (Emerges smoothly as light contracts and gathers during scroll) */}
      <div 
        ref={morphTextRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15 opacity-0 will-change-transform"
        aria-hidden="true"
      >
        <span className="font-display font-extrabold text-5xl min-[360px]:text-6xl sm:text-7xl md:text-8xl lg:text-[clamp(6.5rem,9.5vw,9rem)] xl:text-[clamp(8.5rem,11.5vw,11.5rem)] tracking-[-0.035em] text-[#F4F0EA] uppercase">
          ANNIE
        </span>
        <span className="font-serif italic text-lg sm:text-2xl text-[#A69FAE] mt-2">
          Graphic Designer
        </span>
      </div>

      {/* BASE TYPOGRAPHY CONTENT (pointer-events-none so cursor moves freely across letters) */}
      <div 
        ref={heroContentRef}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 min-[375px]:px-8 sm:px-12 md:px-16 pt-16 sm:pt-20 transition-opacity duration-150 pointer-events-none"
      >
        <div className="flex flex-col items-start max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-none">
          
          {/* ANNIE - Dominant typography */}
          <h1 
            ref={textRef}
            className="font-display font-extrabold text-[2.75rem] min-[360px]:text-[3.25rem] min-[390px]:text-[3.75rem] min-[430px]:text-[4.25rem] sm:text-6xl md:text-7xl lg:text-[clamp(6.5rem,9.5vw,9rem)] xl:text-[clamp(8.5rem,11.5vw,11.5rem)] tracking-[-0.03em] lg:tracking-[-0.035em] leading-[0.92] lg:leading-[0.88] text-[#F4F0EA] uppercase m-0 p-0"
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

          {/* View Work (Moved down slightly with generous vertical spacing, clearly outside spotlight) */}
          <div className="mt-16 min-[360px]:mt-20 sm:mt-24 md:mt-28 pl-0.5 relative z-30 pointer-events-auto">
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
