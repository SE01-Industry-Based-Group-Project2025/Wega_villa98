import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PageTransition = ({ children, transitionKey }) => {
  const containerRef = useRef(null);
  const curtainLeftRef = useRef(null);
  const curtainRightRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const curtainLeft = curtainLeftRef.current;
    const curtainRight = curtainRightRef.current;
    const logo = logoRef.current;

    if (!container || !curtainLeft || !curtainRight || !logo) return;

    // Set initial state
    gsap.set(container, { opacity: 0, scale: 0.95 });
    gsap.set([curtainLeft, curtainRight], { 
      x: 0,
      opacity: 1
    });
    gsap.set(logo, {
      scale: 0,
      rotation: -180,
      opacity: 0
    });

    // Animation timeline
    const tl = gsap.timeline();

    // Logo animation
    tl.to(logo, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)'
    })
    // Brief pause to show logo
    .to(logo, {
      scale: 0.8,
      opacity: 0.8,
      duration: 0.3,
      ease: 'power2.inOut'
    })
    // Curtains slide away
    .to(curtainLeft, {
      x: '-100%',
      duration: 0.8,
      ease: 'power3.inOut'
    }, '-=0.1')
    .to(curtainRight, {
      x: '100%',
      duration: 0.8,
      ease: 'power3.inOut'
    }, '-=0.8')
    .to(logo, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    }, '-=0.6')
    // Content fade in
    .to(container, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4');

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [transitionKey]);

  return (
    <div className="relative min-h-screen">
      {/* Left Curtain */}
      <div
        ref={curtainLeftRef}
        className="fixed top-0 left-0 w-1/2 h-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 z-50"
      />
      
      {/* Right Curtain */}
      <div
        ref={curtainRightRef}
        className="fixed top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-900 via-slate-800 to-slate-700 z-50"
      />

      {/* Transition Logo */}
      <div
        ref={logoRef}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-2xl">
            <svg 
              className="w-10 h-10 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7L12 2z"/>
            </svg>
          </div>
          <h3 className="text-white text-xl font-bold tracking-wider">WEGA VILLA</h3>
        </div>
      </div>
      
      {/* Page Content */}
      <div ref={containerRef} className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
