(() => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const docEl = document.documentElement;
  const appConfig = window.APP_ANIM || {};
  const reduceMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReduce = reduceMedia.matches || appConfig.enabled === false;
  const hasGSAP = typeof window.gsap !== "undefined";
  const animatedNodes = Array.from(document.querySelectorAll("[data-animate]"));

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

  const finalizeElements = () => {
    animatedNodes.forEach((node) => {
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
  };

  if (!hasGSAP || prefersReduce) {
    finalizeElements();
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const splitCache = new WeakMap();

  const prepareSplit = (element) => {
    if (!element || splitCache.has(element)) {
      return splitCache.get(element) || [];
    }
    const text = element.textContent.trim();
    if (!text) {
      return [];
    }
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
    splitCache.set(element, spans);
    return spans;
  };

  const resolveTargets = (root) => {
    const selector = root.dataset.staggerTarget;
    if (selector) {
      const matches = root.matches(selector)
        ? [root]
        : Array.from(root.querySelectorAll(selector));
      if (matches.length) {
        return matches;
      }
    }
    return Array.from(root.children);
  };

  const reveal = (targets, options = {}) => {
    const list = gsap.utils.toArray(targets);
    if (!list.length) {
      return;
    }
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

    const tween = () =>
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

    if (ScrollTrigger) {
      ScrollTrigger.create({
        trigger,
        start,
        once,
        onEnter: tween,
      });
    } else {
      tween();
    }
  };

  const initSplitHeadings = () => {
    const headings = document.querySelectorAll('[data-animate="split-lines"]');
    headings.forEach((heading) => {
      const inHero = heading.closest('[data-animate="hero"]');
      const words = prepareSplit(heading);
      if (inHero || !words.length) {
        return;
      }
      const animateWords = () =>
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
      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: animateWords,
        });
      } else {
        animateWords();
      }
    });
  };

  const initSections = () => {
    document.querySelectorAll('[data-animate="section"]').forEach((section) => {
      if (section.dataset.animInit === "true") {
        return;
      }
      section.dataset.animInit = "true";
      reveal(section, { trigger: section, y: 48, duration: 0.85 });
    });
  };

  const initStaggers = () => {
    document.querySelectorAll('[data-animate="stagger"]').forEach((group) => {
      if (
        group.dataset.animInit === "true" ||
        group.closest('[data-animate="hero"]')
      ) {
        return;
      }
      group.dataset.animInit = "true";
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

    document
      .querySelectorAll('[data-animate="stagger-cards"]')
      .forEach((group) => {
        if (group.dataset.animInit === "true") {
          return;
        }
        group.dataset.animInit = "true";
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
      if (card.dataset.animInit === "true") {
        return;
      }
      card.dataset.animInit = "true";
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
      if (node.dataset.animInit === "true") {
        return;
      }
      const target =
        node.classList.contains("reveal-mask") ||
        node.classList.contains("ratio")
          ? node
          : node.querySelector(".reveal-mask") ||
            node.firstElementChild ||
            node;
      if (!target) {
        return;
      }
      node.dataset.animInit = "true";
      gsap.set(target, {
        clipPath: "inset(0 100% 0 0)",
        transformOrigin: "left center",
        willChange: "clip-path, transform",
        autoAlpha: 0,
      });

      const animateMask = () =>
        gsap.to(target, {
          clipPath: "inset(0 0% 0 0)",
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "clipPath,willChange,autoAlpha",
        });

      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: node,
          start: "top 80%",
          once: true,
          onEnter: animateMask,
        });
      } else {
        animateMask();
      }
    });
  };

  const initParallax = () => {
    if (!ScrollTrigger) {
      return;
    }
    document.querySelectorAll("[data-parallax]").forEach((element) => {
      if (element.dataset.parallaxInit === "true") {
        return;
      }
      element.dataset.parallaxInit = "true";
      const depth = clamp(
        parseFloat(element.dataset.parallax) || 0.12,
        0.02,
        0.45
      );
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

  const initSkewEffects = () => {
    // Disabled - skew effects caused layout issues
    // Cards now use subtle rotation on hover via CSS
    return;
  };

  const initCounters = () => {
    const items = document.querySelectorAll('[data-animate="counter"]');
    items.forEach((item) => {
      if (item.dataset.counterInit === "true") {
        return;
      }
      item.dataset.counterInit = "true";
      const end = parseFloat(item.dataset.counterEnd);
      if (Number.isNaN(end)) {
        return;
      }
      const suffix = item.dataset.counterSuffix || "";
      const format = item.dataset.counterFormat;
      const counterState = { value: 0 };
      const update = () => {
        item.textContent = formatNumber(counterState.value, { suffix, format });
      };
      update();
      const run = () =>
        gsap.to(counterState, {
          value: end,
          duration: 1.4,
          ease: "power3.out",
          onUpdate: update,
          onComplete: update,
        });
      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: item,
          start: "top 80%",
          once: true,
          onEnter: run,
        });
      } else {
        run();
      }
    });
  };

  const initPinnedTracks = () => {
    if (!ScrollTrigger) {
      return;
    }
    document
      .querySelectorAll('[data-animate="pinned-track"]')
      .forEach((track) => {
        if (track.dataset.pinnedInit === "true") {
          return;
        }
        const stages = Array.from(track.querySelectorAll("[data-story-step]"));
        if (stages.length <= 1) {
          return;
        }
        track.dataset.pinnedInit = "true";
        stages.forEach((stage, index) => {
          gsap.set(stage, {
            autoAlpha: index === 0 ? 1 : 0,
            yPercent: index === 0 ? 0 : 16,
          });
        });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out", duration: 0.9 },
        });

        stages.forEach((stage, index) => {
          if (index === 0) {
            return;
          }
          const previous = stages[index - 1];
          tl.to(previous, {
            autoAlpha: 0,
            yPercent: -18,
            ease: "power2.inOut",
          });
          tl.fromTo(
            stage,
            { autoAlpha: 0, yPercent: 18 },
            { autoAlpha: 1, yPercent: 0, ease: "power2.out" },
            "<0.15"
          );
        });

        const segmentSize = () => Math.max(window.innerHeight * 0.85, 360);

        ScrollTrigger.create({
          trigger: track,
          start: "top center",
          end: () => `+=${segmentSize() * stages.length}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          animation: tl,
        });
      });
  };

  const initHero = () => {
    const hero = document.querySelector('[data-animate="hero"]');
    if (!hero) {
      return;
    }
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    const title = hero.querySelector('[data-animate="split-lines"]');
    const subtitle = hero.querySelector('[data-animate="fade"]');
    const copyGroup = hero.querySelector('[data-animate="hero-copy"]');
    const ctaGroup = hero.querySelector('[data-animate="stagger"]');
    const heroVisual = hero.querySelector('[data-animate="hero-visual"]');

    const titleWords = prepareSplit(title);
    const copyTargets = copyGroup ? resolveTargets(copyGroup) : [];
    const ctaTargets = ctaGroup ? resolveTargets(ctaGroup) : [];

    if (copyTargets.length) {
      gsap.set(copyTargets, { autoAlpha: 1 });
    }

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

    if (ScrollTrigger) {
      ScrollTrigger.create({
        trigger: hero,
        start: "top 75%",
        once: true,
        animation: timeline,
      });
    } else {
      timeline.play();
    }
  };

  const initHeroChapters = () => {
    // Chapters section is now static - no pinning or complex animations
    // Just basic fade-in on scroll handled by existing initFloatCards
    return;
  };

  const initHorizontalGallery = () => {
    if (!ScrollTrigger) {
      return;
    }
    document
      .querySelectorAll('[data-animate="horizontal-gallery"]')
      .forEach((gallery) => {
        if (gallery.dataset.galleryInit === "true") {
          return;
        }
        const track = gallery.matches(".showcase-track")
          ? gallery
          : gallery.querySelector(".showcase-track");
        if (!track) {
          return;
        }
        const cards = Array.from(track.querySelectorAll(".showcase-card"));
        const computeDistance = () => track.scrollWidth - gallery.clientWidth;
        if (!cards.length || computeDistance() <= 0) {
          return;
        }
        ScrollTrigger.matchMedia({
          "(min-width: 768px)": () => {
            gallery.dataset.galleryInit = "true";
            const totalDistance = () => -computeDistance();
            gsap.fromTo(
              track,
              { x: 0 },
              {
                x: totalDistance,
                ease: "none",
                scrollTrigger: {
                  trigger: gallery,
                  start: "top top",
                  end: () => `+=${computeDistance()}`,
                  pin: true,
                  scrub: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              }
            );
            return () => {
              delete gallery.dataset.galleryInit;
            };
          },
        });
      });
  };

  const initMagnet = () => {
    const targets = new Set([
      ...document.querySelectorAll('[data-animate="magnet"]'),
      ...document.querySelectorAll(".tilt-card"),
    ]);
    targets.forEach((el) => {
      if (el.dataset.magnetInit === "true") {
        return;
      }
      el.dataset.magnetInit = "true";
      const strength = clamp(
        parseFloat(el.dataset.magnetStrength || "14"),
        6,
        24
      );
      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power2.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power2.out" });
      const rxTo = gsap.quickTo(el, "rotationX", {
        duration: 0.45,
        ease: "power2.out",
      });
      const ryTo = gsap.quickTo(el, "rotationY", {
        duration: 0.45,
        ease: "power2.out",
      });
      const scaleTo = gsap.quickTo(el, "scale", {
        duration: 0.35,
        ease: "power2.out",
      });

      const handleMove = (event) => {
        const rect = el.getBoundingClientRect();
        const relX = clamp(
          (event.clientX - rect.left) / rect.width - 0.5,
          -0.5,
          0.5
        );
        const relY = clamp(
          (event.clientY - rect.top) / rect.height - 0.5,
          -0.5,
          0.5
        );
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

  const initTestimonialCarousel = () => {
    const track = document.querySelector(
      '[data-animate="testimonial-carousel"] .testimonial-track'
    );
    if (!track || track.dataset.carouselInit === "true") {
      return;
    }
    const slides = Array.from(track.querySelectorAll(".testimonial-slide"));
    if (slides.length <= 1) {
      return;
    }
    track.dataset.carouselInit = "true";
    gsap.set(track, { xPercent: 0 });
    gsap.to(track, {
      xPercent: (slides.length - 1) * -100,
      duration: slides.length * 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  };

  const initHeader = () => {
    const header = document.querySelector(".cc-header");
    if (!header || !ScrollTrigger) {
      return;
    }

    // Ensure header starts visible
    gsap.set(header, { yPercent: 0 });

    let isHidden = false;

    const revealHeader = () => {
      if (!isHidden) return;
      isHidden = false;
      gsap.to(header, {
        yPercent: 0,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
      });
      header.classList.remove("nav-hidden");
    };

    const concealHeader = () => {
      if (isHidden) return;
      isHidden = true;
      gsap.to(header, {
        yPercent: -100,
        duration: 0.45,
        ease: "power3.in",
        overwrite: true,
      });
      header.classList.add("nav-hidden");
    };

    ScrollTrigger.create({
      start: "top top",
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self) => {
        const current = self.scroll();

        // Always show when near top
        if (current <= 120) {
          revealHeader();
        } else if (self.direction === -1) {
          // Scrolling up
          revealHeader();
        } else if (self.direction === 1 && current > 160) {
          // Scrolling down and past threshold
          concealHeader();
        }
      },
    });

    ScrollTrigger.addEventListener("refreshInit", () => {
      if (window.scrollY <= 120) {
        revealHeader();
      }
    });
  };

  const initMetricsSection = () => {
    document.querySelectorAll('[data-animate="metrics"]').forEach((section) => {
      if (section.dataset.animInit === "true") {
        return;
      }
      section.dataset.animInit = "true";
      reveal(section, { trigger: section, y: 52, duration: 0.85 });
    });
  };

  const initStickyFilter = () => {
    const filter = document.querySelector(".directory-filter");
    if (!filter || filter.dataset.stickyInit === "true") {
      return;
    }
    filter.dataset.stickyInit = "true";
    if (ScrollTrigger) {
      ScrollTrigger.create({
        trigger: filter,
        start: "top top+=96",
        end: "bottom+=320 top",
        toggleClass: { targets: filter, className: "is-stuck" },
      });
    }
  };

  reduceMedia.addEventListener("change", (event) => {
    if (event.matches) {
      finalizeElements();
    }
  });

  docEl.classList.add("animations-ready");

  if (ScrollTrigger) {
    let resizeTimeout;
    window.addEventListener(
      "resize",
      () => {
        if (prefersReduce) {
          return;
        }
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 180);
      },
      { passive: true }
    );
  }

  initSplitHeadings();
  initHero();
  initHeroChapters();
  initSections();
  initStaggers();
  initFloatCards();
  initMaskReveals();
  initMetricsSection();
  initCounters();
  initParallax();
  initSkewEffects();
  initPinnedTracks();
  initHorizontalGallery();
  initMagnet();
  initTestimonialCarousel();
  initHeader();
  initStickyFilter();
})();
