import React, { useEffect, useRef } from 'react';

interface HeroProps {
  onViewWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewWork }) => {
  const containerRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const morphTextRef = useRef<HTMLDivElement>(null);

  // Position and state references (no React re-renders during 60fps tracking)
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const radiusRef = useRef(60);
  const hasUserInteracted = useRef(false);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const circle = circleRef.current;
    if (!container || !circle) return;

    // Calculate spotlight radius: compact on mobile, scaled proportionally to dominant ANNIE on desktop
    const updateSize = () => {
      const width = window.innerWidth;
      let r = 60;
      if (width < 360) {
        r = 54;
      } else if (width < 450) {
        r = 62;
      } else if (width < 768) {
        r = 74;
      } else if (width < 1024) {
        r = 86;
      } else if (width < 1440) {
        r = 115;
      } else {
        r = 135;
      }
      radiusRef.current = r;
      circle.style.width = `${r * 2}px`;
      circle.style.height = `${r * 2}px`;
    };

    updateSize();

    // Default starting position:
    // Centered directly over the "ANN" portion of ANNIE and the upper portion of Graphic Designer,
    // dynamically calculated from the text's bounding box across mobile, tablet, laptop and desktop.
    const computeDefaultPosition = () => {
      if (!containerRef.current || !textRef.current || !subtitleRef.current) {
        return { x: 120, y: 180 };
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const textRect = textRef.current.getBoundingClientRect();
      const r = radiusRef.current;

      // Horizontal: centered through the "ANN" letters (~28% of ANNIE's width)
      const initialX = textRect.left - containerRect.left + textRect.width * 0.28;

      // Vertical: positioned so the circle covers "ANN" above and upper portion of Graphic Designer
      let initialY = textRect.top - containerRect.top + textRect.height * 0.58;

      // Strict clearance: Ensure bottom edge of spotlight never touches View Work
      if (buttonRef.current) {
        const btnRect = buttonRef.current.getBoundingClientRect();
        const maxSafeY = btnRect.top - containerRect.top - r - 20;
        initialY = Math.min(initialY, maxSafeY);
      }

      return { x: initialX, y: initialY };
    };

    // Apply initial default position immediately (no jump, no delay)
    const defPos = computeDefaultPosition();
    targetPos.current = { x: defPos.x, y: defPos.y };
    currentPos.current = { x: defPos.x, y: defPos.y };
    const initialR = radiusRef.current;
    circle.style.transform = `translate3d(${(defPos.x - initialR).toFixed(1)}px, ${(defPos.y - initialR).toFixed(1)}px, 0)`;

    // Refine default position once custom fonts are loaded (if user hasn't moved yet)
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

    // Constraint helper: Keeps View Work always outside the spotlight
    const clampTargetY = (rawX: number, rawY: number) => {
      const btnElem = buttonRef.current;
      if (!btnElem || !containerRef.current) return rawY;

      const cRect = containerRef.current.getBoundingClientRect();
      const btnRect = btnElem.getBoundingClientRect();
      const r = radiusRef.current;

      const btnTop = btnRect.top - cRect.top;
      const maxAllowedCenterY = btnTop - r - 16;

      // When pointer approaches the column of View Work, stop circle before reaching it
      const isNearButtonX = rawX < btnRect.right - cRect.left + r + 24;
      if (isNearButtonX && rawY > maxAllowedCenterY) {
        return maxAllowedCenterY;
      }

      return rawY;
    };

    // Passive scroll listener for smooth cinematic transition into the next section
    const onScroll = () => {
      if (!containerRef.current) return;
      const sy = window.scrollY;
      const vh = window.innerHeight || 800;
      // Scroll progress from 0 (top of hero) to 1 (near transition boundary)
      const progress = Math.min(1, Math.max(0, sy / (vh * 0.75)));
      scrollProgressRef.current = progress;
    };

    // 60-120fps GPU animation loop with fluid easing and scroll morph
    let animId: number;
    const animate = () => {
      const sp = scrollProgressRef.current;

      if (sp > 0.005) {
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
        // Standard interactive spotlight behavior when at the top of the hero
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

    // Desktop pointer movement listener (tracks smoothly across window)
    const onPointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();

      // Only respond if pointer is within or near the vertical viewport of the hero
      if (e.clientY < cRect.top - 40 || e.clientY > cRect.bottom + 40) return;

      hasUserInteracted.current = true;
      const rawX = e.clientX - cRect.left;
      const rawY = e.clientY - cRect.top;

      targetPos.current.x = rawX;
      targetPos.current.y = clampTargetY(rawX, rawY);
    };

    // Mobile touch listeners (tracks finger dragging with zero lag)
    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches[0] || !containerRef.current) return;
      const touch = e.touches[0];
      const cRect = containerRef.current.getBoundingClientRect();

      hasUserInteracted.current = true;
      const rawX = touch.clientX - cRect.left;
      const rawY = touch.clientY - cRect.top;

      targetPos.current.x = rawX;
      targetPos.current.y = clampTargetY(rawX, rawY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0] || !containerRef.current) return;
      const touch = e.touches[0];
      const cRect = containerRef.current.getBoundingClientRect();

      hasUserInteracted.current = true;
      const rawX = touch.clientX - cRect.left;
      const rawY = touch.clientY - cRect.top;

      targetPos.current.x = rawX;
      targetPos.current.y = clampTargetY(rawX, rawY);
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
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[560px] flex flex-col justify-center pb-16 min-[375px]:pb-20 sm:pb-24 overflow-hidden select-none bg-[#000000] cursor-default"
      style={{ touchAction: 'pan-y' }}
    >
      {/* GPU-ACCELERATED REVEAL SPOTLIGHT (mix-blend-difference) */}
      <div 
        ref={circleRef}
        className="absolute top-0 left-0 rounded-full bg-[#F4F0EA] pointer-events-none mix-blend-difference will-change-transform z-20"
        style={{
          width: '120px',
          height: '120px',
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

      {/* BASE TYPOGRAPHY CONTENT */}
      <div 
        ref={heroContentRef}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 min-[375px]:px-8 sm:px-12 md:px-16 pt-16 sm:pt-20 transition-opacity duration-150"
      >
        <div className="flex flex-col items-start max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-none">
          
          {/* ANNIE - Exact mobile sizing preserved; significantly increased on laptop & desktop */}
          <h1 
            ref={textRef}
            className="font-display font-extrabold text-[2.75rem] min-[360px]:text-[3.25rem] min-[390px]:text-[3.75rem] min-[430px]:text-[4.25rem] sm:text-6xl md:text-7xl lg:text-[clamp(6.5rem,9.5vw,9rem)] xl:text-[clamp(8.5rem,11.5vw,11.5rem)] tracking-[-0.03em] lg:tracking-[-0.035em] leading-[0.92] lg:leading-[0.88] text-[#F4F0EA] uppercase m-0 p-0"
          >
            ANNIE
          </h1>

          {/* Graphic Designer - Untouched */}
          <p 
            ref={subtitleRef}
            className="font-serif italic text-lg min-[360px]:text-xl sm:text-2xl md:text-[28px] lg:text-[32px] text-[#F4F0EA]/85 font-normal mt-2 min-[360px]:mt-2.5 sm:mt-3.5 tracking-tight pl-0.5"
          >
            Graphic Designer
          </p>

          {/* View Work (Always outside spotlight) - Untouched */}
          <div 
            ref={buttonRef}
            className="mt-12 min-[360px]:mt-14 sm:mt-16 pl-0.5 relative z-30 pointer-events-auto"
          >
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
