import { forwardRef, Ref, useEffect, useImperativeHandle, useRef } from "react";

// Lib Perfect-Scrollbar
import PerfectScrollbar from "perfect-scrollbar";

// interfaces
import { ScrollbarProps } from "./interfaces/scrollbar-props.interface";
import { ScrollbarRef } from "./interfaces/scrollbar-ref.interface";

export const Scrollbar = forwardRef<ScrollbarRef, ScrollbarProps>(
  (
    { children, scrollbarOptions, className = "", enabled = true, ...props },
    ref: Ref<ScrollbarRef>) => {

    const containerRef = useRef<HTMLDivElement | null>(null);
    const psRef = useRef<PerfectScrollbar | null>(null);
    const animationRef = useRef<number | null>(null);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // init / destroy
    useEffect(() => {

      if (!enabled || !containerRef.current) return;

      // skip en mobile
      if (isMobile) return;

      psRef.current = new PerfectScrollbar(containerRef.current, scrollbarOptions);

      const handleResize = () => psRef.current?.update();
      window.addEventListener("resize", handleResize);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        psRef.current?.destroy();
        psRef.current = null;
        window.removeEventListener("resize", handleResize);
      };
    }, [enabled, scrollbarOptions]);

    // animate helper
    const animateScrolling = (target: "scrollTop" | "scrollLeft", value: number, speed?: number) => {
      const el = containerRef.current!;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (!speed) {
        el[target] = value;
        return;
      }
      let newValue = 0;
      let scrollCount = 0;
      let oldTimestamp = performance.now();
      let oldValue = el[target];
      const cosParameter = (oldValue - value) / 2;

      const step = (newTimestamp: number) => {
        scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));
        newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

        if (el[target] === oldValue) {
          if (scrollCount >= Math.PI) {
            el[target] = value;
          } else {
            el[target] = newValue;
            oldValue = el[target];
            oldTimestamp = newTimestamp;
            animationRef.current = requestAnimationFrame(step);
          }
        }
      };
      requestAnimationFrame(step);
    };

    // expose methods
    useImperativeHandle(ref, (): ScrollbarRef => ({
      isEnabled: () => !!psRef.current,
      update: () => psRef.current?.update(),
      destroy: () => {
        psRef.current?.destroy();
        psRef.current = null;
      },
      geometry: () => {
        const el = containerRef.current!;
        return {
          x: el.scrollLeft,
          y: el.scrollTop,
          w: el.scrollWidth,
          h: el.scrollHeight,
        };
      },
      position: (absolute = false) => {
        if (!absolute && psRef.current) {
          return {
            x: (psRef.current as any).reach?.x || 0,
            y: (psRef.current as any).reach?.y || 0,
          };
        }
        const el = containerRef.current!;
        return { x: el.scrollLeft, y: el.scrollTop };
      },
      scrollTo: (x: number, y?: number, speed?: number) => {
        if (y == null) {
          animateScrolling("scrollTop", x, speed);
        } else {
          if (x != null) animateScrolling("scrollLeft", x, speed);
          if (y != null) animateScrolling("scrollTop", y, speed);
        }
      },
      scrollToX: (x, speed) => animateScrolling("scrollLeft", x, speed),
      scrollToY: (y, speed) => animateScrolling("scrollTop", y, speed),
      scrollToTop: (offset = 0, speed) => animateScrolling("scrollTop", offset, speed),
      scrollToBottom: (offset = 0, speed) => {
        const el = containerRef.current!;
        const top = el.scrollHeight - el.clientHeight;
        animateScrolling("scrollTop", top - offset, speed);
      },
      scrollToLeft: (offset = 0, speed) => animateScrolling("scrollLeft", offset, speed),
      scrollToRight: (offset = 0, speed) => {
        const el = containerRef.current!;
        const left = el.scrollWidth - el.clientWidth;
        animateScrolling("scrollLeft", left - offset, speed);
      },
      scrollToElement: (selector, offset = 0, ignoreVisible = false, speed?: number) => {
        const el = containerRef.current!;
        const element = el.querySelector(selector) as HTMLElement | null;
        if (!element) return;

        const elementPos = element.getBoundingClientRect();
        const scrollerPos = el.getBoundingClientRect();

        if (el.classList.contains("ps--active-x")) {
          if (ignoreVisible && elementPos.right <= scrollerPos.right - Math.abs(offset)) return;
          const currentPos = el.scrollLeft;
          const position = elementPos.left - scrollerPos.left + currentPos;
          animateScrolling("scrollLeft", position + offset, speed);
        }
        if (el.classList.contains("ps--active-y")) {
          if (ignoreVisible && elementPos.bottom <= scrollerPos.bottom - Math.abs(offset)) return;
          const currentPos = el.scrollTop;
          const position = elementPos.top - scrollerPos.top + currentPos;
          animateScrolling("scrollTop", position + offset, speed);
        }
      },
    }));

    return (
      <div ref={containerRef} className={`${className} ${isMobile ? "mobile-scrollbar" : ""}`} {...props}>
        {children}
      </div>
    );
  }
);

export default Scrollbar;