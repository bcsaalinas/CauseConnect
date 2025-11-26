import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useHomeAnimations() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const reduceMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMedia.matches) return;

    // --- Helper: Scramble Text Effect ---
    const scrambleText = (element, finalText, duration = 1) => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      const tl = gsap.timeline();
      const obj = { p: 0 };
      
      tl.to(obj, {
        p: 1,
        duration: duration,
        ease: "power4.out",
        onUpdate: () => {
          const progress = obj.p;
          const len = finalText.length;
          let str = "";
          for (let i = 0; i < len; i++) {
            if (i < progress * len) {
              str += finalText[i];
            } else {
              str += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          element.textContent = str;
        },
        onComplete: () => {
          element.textContent = finalText;
        }
      });
      return tl;
    };

    // --- Hero Section Animation ---
    const heroTimeline = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    // Masked Text Reveal for Hero Title (Premium & Stable)
    const heroTitle = containerRef.current.querySelector('.hero-title');
    if (heroTitle) {
      const text = heroTitle.textContent.trim();
      heroTitle.innerHTML = '';
      
      const words = text.split(' ');
      words.forEach((word, i) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word-wrapper';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.overflow = 'hidden';
        wordSpan.style.verticalAlign = 'bottom'; // Better alignment
        wordSpan.style.paddingBottom = '0.1em'; // Prevent descender clipping
        
        const innerSpan = document.createElement('span');
        innerSpan.className = 'word-inner';
        innerSpan.style.display = 'inline-block';
        innerSpan.textContent = word;
        
        wordSpan.appendChild(innerSpan);
        heroTitle.appendChild(wordSpan);
        
        if (i < words.length - 1) {
          heroTitle.appendChild(document.createTextNode(' '));
        }
      });
      
      heroTimeline.fromTo('.word-inner', 
        { yPercent: 110, skewY: 7 },
        { yPercent: 0, skewY: 0, duration: 1.2, stagger: 0.06, ease: "power4.out" },
        0
      );
    }

    // Hero Subtitle & Eyebrow
    heroTimeline.fromTo(['.eyebrow', '.hero-subtitle'],
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "power2.out" },
      "-=0.9"
    );

    // Hero Buttons with Magnetic Effect & Glow
    const buttons = containerRef.current.querySelectorAll('.hero-copy .btn');
    const cleanupFns = [];
    
    if (buttons.length) {
      heroTimeline.fromTo(buttons,
        { y: 20, autoAlpha: 0, scale: 0.9 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" },
        "-=0.8"
      );

      buttons.forEach(btn => {
        const handleMove = (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.4, ease: "power2.out" });
        };
        const handleLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.6)" });
        };

        btn.addEventListener('mousemove', handleMove);
        btn.addEventListener('mouseleave', handleLeave);
        
        cleanupFns.push(() => {
          btn.removeEventListener('mousemove', handleMove);
          btn.removeEventListener('mouseleave', handleLeave);
        });
      });
    }

    // Hero Visual - Elegant Float & Tilt
    const heroVisual = containerRef.current.querySelector('.hero-glass-panel');
    if (heroVisual) {
      heroTimeline.fromTo(heroVisual,
        { scale: 0.9, autoAlpha: 0, y: 40, rotationX: 10 },
        { scale: 1, autoAlpha: 1, y: 0, rotationX: 0, duration: 1.6, ease: "power3.out" },
        "-=1.1"
      );
      
      gsap.to(heroVisual, {
        y: -15,
        rotationX: 3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.6
      });
    }

    // Parallax Backgrounds (Subtle & Smooth)
    const layers = gsap.utils.toArray('.hero-ambient__layer');
    layers.forEach((layer, i) => {
      const depth = (i + 1) * 0.15;
      gsap.to(layer, {
        yPercent: 30 * depth,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-premium",
          start: "top top",
          end: "bottom top",
          scrub: 0.5 // Smooth scrubbing
        }
      });
    });


    // --- Highlights Section (Cards with Shimmer) ---
    const highlightCards = gsap.utils.toArray('.hero-highlights .glass-panel');
    if (highlightCards.length) {
      ScrollTrigger.batch(highlightCards, {
        onEnter: batch => gsap.fromTo(batch, 
          { y: 40, autoAlpha: 0, scale: 0.95 }, 
          { y: 0, autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }
        ),
        start: "top 85%"
      });
      
      // Add hover shimmer effect via CSS class or GSAP
      highlightCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -5, scale: 1.02, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
        });
      });
    }

    // --- Chapters Section (Curtain Reveal) ---
    const chapters = gsap.utils.toArray('.chapter-row');
    chapters.forEach((chapter, i) => {
      const imageWrapper = chapter.querySelector('.chapter-image-wrapper');
      const content = chapter.querySelector('.chapter-card');
      const isEven = i % 2 === 0;

      // Ensure initial state is set immediately (Content only)
      gsap.set(content, { x: isEven ? 40 : -40, autoAlpha: 0 });

      // Image Parallax (Subtle movement within the wrapper)
      const img = imageWrapper.querySelector('img');
      if (img) {
        gsap.fromTo(img, 
          { yPercent: -10 },
          { 
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      }

      // Content Slide
      gsap.to(content, { 
        x: 0, autoAlpha: 1, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: chapter,
          start: "top 70%"
        }
      });
      
      // Image Reveal (Scale + Blur + Fade - Premium & Stable)
      gsap.fromTo(imageWrapper,
        { scale: 0.95, autoAlpha: 0, filter: "blur(10px)" },
        { 
          scale: 1, 
          autoAlpha: 1, 
          filter: "blur(0px)",
          duration: 1.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: chapter,
            start: "top 80%"
          }
        }
      );
    });




    // --- Stats Section (Slot Machine) ---
    const statsSection = containerRef.current.querySelector('.hero-stats');
    if (statsSection) {
      const statItems = gsap.utils.toArray('.stat-item', statsSection);
      
      gsap.fromTo(statItems,
        { scale: 0.5, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: statsSection,
            start: "top 85%"
          }
        }
      );

      const counters = gsap.utils.toArray('.stat-value', statsSection);
      counters.forEach(counter => {
        const endValue = parseFloat(counter.dataset.value);
        const suffix = counter.dataset.suffix || '';
        
        if (!isNaN(endValue)) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: endValue,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsSection,
              start: "top 85%"
            },
            onUpdate: () => {
              counter.innerText = Math.floor(obj.val).toLocaleString() + suffix;
            }
          });
        }
      });
    }

    // --- GlobalGiving Section ---
    const ggSection = containerRef.current.querySelector('.globalgiving-section');
    if (ggSection) {
      const cards = gsap.utils.toArray('.directory-card', ggSection);
      if (cards.length) {
        gsap.fromTo(cards,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ggSection,
              start: "top 80%"
            }
          }
        );
      }
    }

    // --- Creators Section ---
    const creatorsSection = containerRef.current.querySelector('.creators-section');
    if (creatorsSection) {
      const cards = gsap.utils.toArray('.creator-card', creatorsSection);
      gsap.fromTo(cards,
        { y: 50, autoAlpha: 0, rotation: 2 },
        {
          y: 0,
          autoAlpha: 1,
          rotation: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: creatorsSection,
            start: "top 75%"
          }
        }
      );
    }

    // --- Hero CTA ---
    const ctaSection = containerRef.current.querySelector('.hero-cta');
    if (ctaSection) {
      const band = ctaSection.querySelector('.cta-band');
      gsap.fromTo(band,
        { scale: 0.95, autoAlpha: 0, y: 30 },
        {
          scale: 1,
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaSection,
            start: "top 85%"
          }
        }
      );
    }

    // Return cleanup function for the useGSAP hook
    return () => {
      cleanupFns.forEach(fn => fn());
    };

  }, { scope: containerRef });

  return containerRef;
}
