"use client";

import { useEffect, useRef } from "react";

/**
 * SmoothScroll Component
 * Memberikan pengalaman smooth scrolling premium (Lenis) untuk desktop & tablet (>= 768px).
 * Mempertahankan native momentum scrolling untuk smartphone agar bebas jank & hemat memori.
 * Mematuhi preferensi accessibility `prefers-reduced-motion`.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // 1. Cek apakah preferensi reduced motion aktif
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // 2. Hanya aktifkan pada layar Tablet & Desktop (>= 768px)
    // Perangkat mobile tetap memakai native momentum scroll browser yang sudah 120Hz di iOS/Android
    const isDesktopOrTablet = window.innerWidth >= 768;
    if (!isDesktopOrTablet) return;

    let lenisInstance: any = null;
    let tickerCallback: any = null;

    const initLenis = async () => {
      try {
        const Lenis = (await import("lenis")).default;

        lenisInstance = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.2,
          infinite: false,
        });

        lenisRef.current = lenisInstance;

        // Hubungkan ke GSAP ScrollTrigger jika ada
        try {
          const { ScrollTrigger } = await import("gsap/ScrollTrigger");
          lenisInstance.on("scroll", ScrollTrigger.update);
        } catch {
          // Abaikan jika GSAP belum ter-load
        }

        // Ticker rAF yang hemat daya CPU
        let rafId: number;
        function raf(time: number) {
          lenisInstance.raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        tickerCallback = rafId;

        // Handler untuk anchor links (#layanan, #apbdes, dsb) agar smooth dengan offset navbar
        const handleAnchorClick = (e: MouseEvent) => {
          const target = (e.target as HTMLElement).closest("a");
          if (!target) return;
          const href = target.getAttribute("href");
          if (href && href.startsWith("#") && href.length > 1) {
            const targetEl = document.querySelector(href);
            if (targetEl && lenisInstance) {
              e.preventDefault();
              lenisInstance.scrollTo(targetEl, {
                offset: -76, // Kompensasi sticky navbar
                duration: 1.2,
              });
            }
          }
        };

        document.addEventListener("click", handleAnchorClick);

        return () => {
          document.removeEventListener("click", handleAnchorClick);
          if (rafId) cancelAnimationFrame(rafId);
          if (lenisInstance) lenisInstance.destroy();
        };
      } catch (err) {
        console.warn("Smooth scroll initialization error:", err);
      }
    };

    let cleanupPromise = initLenis();

    return () => {
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === "function") cleanup();
      });
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
}
