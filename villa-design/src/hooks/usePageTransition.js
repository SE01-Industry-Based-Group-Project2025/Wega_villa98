import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { gsap } from 'gsap';

export const usePageTransition = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const transitionTo = useCallback((path) => {
    // Create exit animation with curtain effect
    const exitTimeline = gsap.timeline();
    
    // First, fade out the current content
    exitTimeline.to('.page-content', {
      opacity: 0,
      scale: 0.98,
      duration: 0.3,
      ease: 'power2.in'
    })
    // Add a slight delay for smooth transition
    .to({}, {
      duration: 0.1,
      onComplete: () => {
        navigate(path);
      }
    });
  }, [navigate]);

  return {
    transitionTo,
    currentPath: location.pathname
  };
};
