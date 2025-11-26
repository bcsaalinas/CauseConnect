import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useGSAP(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Hover Effects
    const handleHover = () => {
      gsap.to(cursorRef.current, { scale: 0.5, opacity: 0, duration: 0.2 });
      gsap.to(followerRef.current, { scale: 3, backgroundColor: 'rgba(0, 242, 234, 0.1)', borderColor: 'transparent', duration: 0.2 });
    };

    const handleLeave = () => {
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(followerRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'var(--cc-accent)', duration: 0.2 });
    };

    const links = document.querySelectorAll('a, button, .hover-target');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleHover);
      link.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleHover);
        link.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, { scope: cursorRef });

  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed-top rounded-circle bg-accent pointer-events-none"
        style={{ width: '8px', height: '8px', transform: 'translate(-50%, -50%)', zIndex: 9999, mixBlendMode: 'difference' }}
      ></div>
      <div 
        ref={followerRef} 
        className="fixed-top rounded-circle border border-accent pointer-events-none"
        style={{ width: '40px', height: '40px', transform: 'translate(-50%, -50%)', zIndex: 9998, transition: 'transform 0.1s ease' }}
      ></div>
    </>
  );
}

export default CustomCursor;
