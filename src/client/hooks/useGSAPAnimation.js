import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatNumber = (value, { suffix = "", format } = {}) => {
  if (format === "compact" && typeof Intl !== "undefined") {
    return `${new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)}${suffix}`;
  }
  return `${Math.round(value).toLocaleString("en-US")}${suffix}`;
};

export function useGSAPAnimation() {
  const location = useLocation();

  useGSAP(() => {
    const reduceMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReduce = reduceMedia.matches;

    if (prefersReduce) {
      // Finalize elements immediately if reduced motion
      document.querySelectorAll("[data-animate]").forEach((node) => {
        if (node.dataset.animate === "counter") {
          const end = parseFloat(node.dataset.counterEnd);
          if (!Number.isNaN(end)) {
            node.textContent = formatNumber(end, {
              suffix: node.dataset.counterSuffix || "",
              format: node.dataset.counterFormat,
            });
          }
        }
        node.style.opacity = "1";
        node.style.transform = "none";
        node.classList.add("is-visible");
      });
      return;
    }

    // Helper functions
    const resolveTargets = (root) => {
      const selector = root.dataset.staggerTarget;
      if (selector) {
        const matches = root.matches(selector)
          ? [root]
          : Array.from(root.querySelectorAll(selector));
        if (matches.length) return matches;
      }
      return Array.from(root.children);
    };

    const reveal = (targets, options = {}) => {
      const list = gsap.utils.toArray(targets);
      if (!list.length) return;
      const {
        trigger = list[0],
        start = "top 80%",
        once = true,
        y = 32,
        duration = 0.75,
        ease = "power2.out",
        stagger = 0.08,
        delay = 0,
      } = options;

      ScrollTrigger.create({
        trigger,
        start,
        once,
        onEnter: () => {
          gsap.fromTo(
            list,
            { autoAlpha: 0, y },
            {
              autoAlpha: 1,
              y: 0,
              duration,
              ease,
              stagger,
              delay,
              overwrite: "auto",
              clearProps: "all",
            }
          );
        },
      });
    };

    const prepareSplit = (element) => {
      if (!element || element.querySelector('.split-word')) return Array.from(element.querySelectorAll('.split-word'));
      const text = element.textContent.trim();
      if (!text) return [];
      element.setAttribute("aria-label", text);
      element.setAttribute("role", "text");
      const words = text.split(/\s+/);
      const frag = document.createDocumentFragment();
      const spans = [];
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = "split-word";
        span.textContent = word;
        span.setAttribute("aria-hidden", "true");
        span.style.display = "inline-block";
        span.style.willChange = "transform, opacity";
        frag.appendChild(span);
        spans.push(span);
        if (index < words.length - 1) {
          frag.appendChild(document.createTextNode(" "));
        }
      });
      element.textContent = "";
      element.appendChild(frag);
      return spans;
    };

    // Init functions
    const initSplitHeadings = () => {
      document.querySelectorAll('[data-animate="split-lines"]').forEach((heading) => {
        const inHero = heading.closest('[data-animate="hero"]');
        const words = prepareSplit(heading);
        if (inHero || !words.length) return;
        
        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              words,
              { yPercent: 120, autoAlpha: 0, skewY: 6 },
              {
                yPercent: 0,
                autoAlpha: 1,
                skewY: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.06,
                clearProps: "all",
              }
            );
          },
        });
      });
    };

    const initSections = () => {
      document.querySelectorAll('[data-animate="section"]').forEach((section) => {
        reveal(section, { trigger: section, y: 48, duration: 0.85 });
      });
    };

    const initStaggers = () => {
      document.querySelectorAll('[data-animate="stagger"]').forEach((group) => {
        if (group.closest('[data-animate="hero"]')) return;
        const targets = resolveTargets(group);
        const localStagger = parseFloat(
          group.dataset.staggerAmount || group.dataset.stagger || "0.08"
        );
        reveal(targets, {
          trigger: group,
          y: 42,
          duration: 0.8,
          stagger: clamp(localStagger, 0.02, 0.25),
        });
      });

      document.querySelectorAll('[data-animate="stagger-cards"]').forEach((group) => {
        const targets = resolveTargets(group);
        reveal(targets, {
          trigger: group,
          y: 56,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        });
      });
    };

    const initFloatCards = () => {
      document.querySelectorAll('[data-animate="float-card"]').forEach((card) => {
        reveal(card, {
          trigger: card,
          y: 52,
          duration: 0.95,
          ease: "power3.out",
        });
      });
    };

    const initMaskReveals = () => {
      document.querySelectorAll('[data-animate="mask"]').forEach((node) => {
        const target =
          node.classList.contains("reveal-mask") ||
          node.classList.contains("ratio")
            ? node
            : node.querySelector(".reveal-mask") ||
              node.firstElementChild ||
              node;
        if (!target) return;

        gsap.set(target, {
          clipPath: "inset(0 100% 0 0)",
          transformOrigin: "left center",
          willChange: "clip-path, transform",
          autoAlpha: 0,
        });

        ScrollTrigger.create({
          trigger: node,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(target, {
              clipPath: "inset(0 0% 0 0)",
              autoAlpha: 1,
              duration: 0.9,
              ease: "power3.out",
              clearProps: "clipPath,willChange,autoAlpha",
            });
          },
        });
      });
    };

    const initHero = () => {
      const hero = document.querySelector('[data-animate="hero"]');
      if (!hero) return;
      
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      const title = hero.querySelector('[data-animate="split-lines"]');
      const subtitle = hero.querySelector('[data-animate="fade"]');
      const copyGroup = hero.querySelector('[data-animate="hero-copy"]');
      const ctaGroup = hero.querySelector('[data-animate="stagger"]');
      const heroVisual = hero.querySelector('[data-animate="hero-visual"]');

      const titleWords = prepareSplit(title);
      const copyTargets = copyGroup ? resolveTargets(copyGroup) : [];
      const ctaTargets = ctaGroup ? resolveTargets(ctaGroup) : [];

      if (copyTargets.length) gsap.set(copyTargets, { autoAlpha: 1 });

      timeline.addLabel("intro");

      if (titleWords.length) {
        timeline.fromTo(
          titleWords,
          { yPercent: 120, autoAlpha: 0, skewY: 6 },
          {
            yPercent: 0,
            autoAlpha: 1,
            skewY: 0,
            duration: 1.1,
            stagger: 0.05,
          },
          "intro"
        );
      }

      if (subtitle) {
        timeline.fromTo(
          subtitle,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          titleWords.length ? "-=0.55" : "intro+=0.2"
        );
      }

      if (ctaTargets.length) {
        timeline.fromTo(
          ctaTargets,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }

      if (heroVisual) {
        timeline.fromTo(
          heroVisual,
          { autoAlpha: 0, y: 48, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.7"
        );
      }
    };

    const initCounters = () => {
      document.querySelectorAll('[data-animate="counter"]').forEach((item) => {
        const end = parseFloat(item.dataset.counterEnd);
        if (Number.isNaN(end)) return;
        const suffix = item.dataset.counterSuffix || "";
        const format = item.dataset.counterFormat;
        const counterState = { value: 0 };
        
        const update = () => {
          item.textContent = formatNumber(counterState.value, { suffix, format });
        };
        
        ScrollTrigger.create({
          trigger: item,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(counterState, {
              value: end,
              duration: 1.4,
              ease: "power3.out",
              onUpdate: update,
              onComplete: update,
            });
          },
        });
      });
    };

    const initParallax = () => {
      document.querySelectorAll("[data-parallax]").forEach((element) => {
        const depth = clamp(parseFloat(element.dataset.parallax) || 0.12, 0.02, 0.45);
        const offset = depth * 50;
        gsap.fromTo(
          element,
          { yPercent: -offset },
          {
            yPercent: offset,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    };

    const initMagnet = () => {
      const targets = document.querySelectorAll('[data-animate="magnet"], .tilt-card');
      targets.forEach((el) => {
        if (el.dataset.magnetInit === "true") return;
        el.dataset.magnetInit = "true";
        const strength = clamp(parseFloat(el.dataset.magnetStrength || "14"), 6, 24);
        const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power2.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power2.out" });
        const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.45, ease: "power2.out" });
        const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.45, ease: "power2.out" });
        const scaleTo = gsap.quickTo(el, "scale", { duration: 0.35, ease: "power2.out" });

        const handleMove = (event) => {
          const rect = el.getBoundingClientRect();
          const relX = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
          const relY = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
          xTo(relX * strength);
          yTo(relY * strength);
          rxTo(relY * -strength);
          ryTo(relX * strength);
          scaleTo(1.02);
        };

        const reset = () => {
          xTo(0);
          yTo(0);
          rxTo(0);
          ryTo(0);
          scaleTo(1);
        };

        el.addEventListener("pointermove", handleMove);
        el.addEventListener("pointerleave", reset);
        el.addEventListener("pointerup", reset);
      });
    };

    const initHeader = () => {
      const header = document.querySelector(".cc-header");
      if (!header) return;
      gsap.set(header, { yPercent: 0 });
      let isHidden = false;

      const excludedPaths = ['/directory', '/sdgs', '/contact'];

      const revealHeader = () => {
        if (!isHidden) return;
        isHidden = false;
        gsap.to(header, { yPercent: 0, duration: 0.4, ease: "power3.out", overwrite: true });
        header.classList.remove("nav-hidden");
      };

      const concealHeader = () => {
        if (isHidden || excludedPaths.includes(window.location.pathname)) return;
        isHidden = true;
        gsap.to(header, { yPercent: -100, duration: 0.45, ease: "power3.in", overwrite: true });
        header.classList.add("nav-hidden");
      };

      ScrollTrigger.create({
        start: "top top",
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: (self) => {
          const current = self.scroll();
          if (current <= 120) revealHeader();
          else if (self.direction === -1) revealHeader();
          else if (self.direction === 1 && current > 160) concealHeader();
        },
      });
    };

    // Run initializations
    // We use a small timeout to ensure DOM is ready and layout is settled
    const timer = setTimeout(() => {
      initSplitHeadings();
      initHero();
      initSections();
      initStaggers();
      initFloatCards();
      initMaskReveals();
      initCounters();
      initParallax();
      initMagnet();
      initHeader();
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);

  }, { dependencies: [location.pathname], revertOnUpdate: true });
}
