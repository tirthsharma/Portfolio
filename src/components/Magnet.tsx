import React, { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  maxDistance?: number;
  damping?: number;
  rotateStrength?: number;
  floatClassName?: string;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  disabled?: boolean;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  maxDistance = 70,
  damping = 0.10,
  rotateStrength = 0,
  floatClassName = 'hero-character-float',
  className = '',
  disabled = false,
}) => {
  // Untransformed anchor element for stable center and bounding box calculations
  const anchorRef = useRef<HTMLDivElement>(null);
  // Transformed inner content element receiving compositor-friendly translate3d on desktop
  const contentRef = useRef<HTMLDivElement>(null);

  // Mutable animation state stored in refs to prevent React re-renders during high-frequency motion
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const isWithinZone = useRef(false);
  const rafId = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);

  // Robust pointer capability detection (distinguishes desktop mouse/trackpad vs touch phones/tablets)
  const [canHover, setCanHover] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Track media query updates (e.g. connecting an external mouse or changing OS accessibility)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateHover = (e: MediaQueryListEvent) => setCanHover(e.matches);
    const updateMotion = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    hoverQuery.addEventListener('change', updateHover);
    motionQuery.addEventListener('change', updateMotion);

    return () => {
      hoverQuery.removeEventListener('change', updateHover);
      motionQuery.removeEventListener('change', updateMotion);
    };
  }, []);

  // Desktop cursor-following effect (only active when a hover-capable fine pointer is present)
  useEffect(() => {
    if (disabled || !canHover) {
      // Ensure content transform is reset when switching away from desktop pointer mode
      if (contentRef.current) {
        contentRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
      }
      return;
    }

    const anchorEl = anchorRef.current;
    const contentEl = contentRef.current;
    if (!anchorEl || !contentEl) return;

    // Cache the untransformed bounding rect; invalidate on scroll and resize to prevent layout thrashing
    let cachedRect: DOMRect | null = null;

    const updateRect = () => {
      if (anchorEl) {
        cachedRect = anchorEl.getBoundingClientRect();
      }
    };

    window.addEventListener('resize', updateRect, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });

    // Core animation frame loop using damped linear interpolation (lerp)
    const animate = (time: number) => {
      if (!lastTime.current) {
        lastTime.current = time;
      }
      const deltaMs = Math.min(time - lastTime.current, 64);
      lastTime.current = time;

      // Delta-time adjusted lerp factor for 60Hz/120Hz/ProMotion frame rate independence
      const baseFps = 60;
      const factor = 1 - Math.pow(1 - damping, deltaMs / (1000 / baseFps));

      const tx = targetPos.current.x;
      const ty = targetPos.current.y;
      const cx = currentPos.current.x;
      const cy = currentPos.current.y;

      const nextX = cx + (tx - cx) * factor;
      const nextY = cy + (ty - cy) * factor;

      currentPos.current.x = nextX;
      currentPos.current.y = nextY;

      // Direct DOM write using GPU-composited translate3d transform with optional subtle rotation
      const rot = rotateStrength ? nextX * rotateStrength : 0;
      contentEl.style.transform = rot
        ? `translate3d(${nextX.toFixed(2)}px, ${nextY.toFixed(2)}px, 0px) rotate(${rot.toFixed(2)}deg)`
        : `translate3d(${nextX.toFixed(2)}px, ${nextY.toFixed(2)}px, 0px)`;

      // Settling and stopping conditions
      const distToTarget = Math.hypot(tx - nextX, ty - nextY);
      const isSettlingAtNeutral = !isWithinZone.current && Math.hypot(nextX, nextY) < 0.05;

      if (isSettlingAtNeutral) {
        currentPos.current.x = 0;
        currentPos.current.y = 0;
        contentEl.style.transform = 'translate3d(0px, 0px, 0px)';
        rafId.current = null;
        lastTime.current = null;
        return;
      }

      if (distToTarget < 0.01 && isWithinZone.current) {
        // Settled at current active target; pause rAF until subsequent mouse movement
        currentPos.current.x = tx;
        currentPos.current.y = ty;
        const targetRot = rotateStrength ? tx * rotateStrength : 0;
        contentEl.style.transform = targetRot
          ? `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0px) rotate(${targetRot.toFixed(2)}deg)`
          : `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0px)`;
        rafId.current = null;
        lastTime.current = null;
        return;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (rafId.current === null) {
        lastTime.current = null;
        rafId.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cachedRect) {
        cachedRect = anchorEl.getBoundingClientRect();
      }

      const centerX = cachedRect.left + cachedRect.width / 2;
      const centerY = cachedRect.top + cachedRect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      const isInside =
        Math.abs(distX) <= cachedRect.width / 2 + padding &&
        Math.abs(distY) <= cachedRect.height / 2 + padding;

      if (isInside) {
        isWithinZone.current = true;
        let offsetX = distX / strength;
        let offsetY = distY / strength;

        // Predictable displacement bounds: soft clamp to prevent character drifting too far
        const offsetDist = Math.hypot(offsetX, offsetY);
        if (offsetDist > maxDistance) {
          const ratio = maxDistance / offsetDist;
          offsetX *= ratio;
          offsetY *= ratio;
        }

        targetPos.current.x = offsetX;
        targetPos.current.y = offsetY;
      } else {
        if (isWithinZone.current) {
          isWithinZone.current = false;
          targetPos.current.x = 0;
          targetPos.current.y = 0;
        }
      }

      startAnimation();
    };

    const handleMouseLeaveWindow = () => {
      isWithinZone.current = false;
      targetPos.current.x = 0;
      targetPos.current.y = 0;
      startAnimation();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow, { passive: true });
    window.addEventListener('blur', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      window.removeEventListener('blur', handleMouseLeaveWindow);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [padding, strength, maxDistance, damping, rotateStrength, disabled, canHover, prefersReducedMotion]);

  // Mobile & tablet idle float is enabled when device lacks hover-capable fine pointer
  const isFloating = !disabled && !canHover;

  return (
    <div ref={anchorRef} className={`inline-block ${className}`}>
      {/* Layer 1: Dedicated cursor-following container (desktop with mouse/trackpad) */}
      <div
        ref={contentRef}
        style={{ willChange: canHover ? 'transform' : 'auto' }}
      >
        {/* Layer 2: Dedicated floating container (touch mobile and tablet devices) */}
        <div
          className={isFloating ? floatClassName : ''}
          style={{ willChange: isFloating ? 'transform' : 'auto' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Magnet;
