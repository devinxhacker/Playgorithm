import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * Provides a performant way to animate elements as they enter the viewport
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1), default 0.1
 * @param {string} options.rootMargin - Root margin for earlier/later triggering
 * @param {boolean} options.triggerOnce - Only trigger animation once (default true)
 * @param {number} options.delay - Animation delay in ms
 * @returns {Object} - { ref, isVisible, hasAnimated }
 */
export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasAnimated(true);
          }
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return { ref, isVisible, hasAnimated };
};

/**
 * Hook for staggered animations on multiple children
 * Useful for animating lists, grids, and card collections
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.staggerDelay - Delay between each child animation (ms)
 * @param {number} options.baseDelay - Initial delay before first animation (ms)
 * @param {number} options.threshold - Visibility threshold
 * @returns {Object} - { containerRef, isVisible, getStaggerDelay }
 */
export const useStaggerAnimation = (options = {}) => {
  const {
    staggerDelay = 100,
    baseDelay = 0,
    threshold = 0.1
  } = options;

  const { ref: containerRef, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce: true
  });

  const getStaggerDelay = useCallback((index) => {
    return baseDelay + (index * staggerDelay);
  }, [baseDelay, staggerDelay]);

  return { containerRef, isVisible, getStaggerDelay };
};

/**
 * Hook for scroll-based parallax effect
 * Creates a smooth parallax movement based on scroll position
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.speed - Parallax speed multiplier (default 0.5)
 * @param {string} options.direction - 'up' or 'down' (default 'up')
 * @returns {Object} - { ref, offset }
 */
export const useParallax = (options = {}) => {
  const { speed = 0.5, direction = 'up' } = options;
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Only calculate when element is in or near viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const elementTop = rect.top + scrolled;
        const relativeScroll = scrolled - elementTop + windowHeight;
        const movement = relativeScroll * speed;
        
        setOffset(direction === 'up' ? -movement : movement);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { ref, offset };
};

/**
 * Hook for scroll progress tracking
 * Useful for progress bars and scroll indicators
 * 
 * @returns {number} - Scroll progress from 0 to 100
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};

/**
 * Hook for detecting scroll direction
 * 
 * @returns {Object} - { scrollDirection, isScrolling }
 */
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('none');
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      
      lastScrollY.current = currentScrollY;
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set scrolling to false after scroll stops
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return { scrollDirection, isScrolling };
};

export default useScrollAnimation;
