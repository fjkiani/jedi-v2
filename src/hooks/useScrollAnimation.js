import { useEffect, useRef, useState } from 'react';

// Custom hook for scroll-triggered animations
export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
    animationType = 'fadeIn'
  } = options;

  const elementRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) setHasTriggered(true);
            }, delay);
          } else {
            setIsVisible(true);
            if (triggerOnce) setHasTriggered(true);
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  // Animation classes based on type
  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    
    switch (animationType) {
      case 'fadeIn':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
      case 'slideInLeft':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`;
      case 'slideInRight':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`;
      case 'slideInUp':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`;
      case 'scaleIn':
        return `${baseClasses} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      case 'fadeInScale':
        return `${baseClasses} ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`;
      default:
        return `${baseClasses} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  return {
    ref: elementRef,
    isVisible,
    animationClasses: getAnimationClasses()
  };
};

// Staggered animation hook for lists/grids
export const useStaggeredAnimation = (itemCount, options = {}) => {
  const {
    baseDelay = 0,
    staggerDelay = 100,
    threshold = 0.1,
    triggerOnce = true
  } = options;

  const containerRef = useRef();
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger items with staggered delays
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, i]));
            }, baseDelay + (i * staggerDelay));
          }
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [itemCount, baseDelay, staggerDelay, threshold]);

  const getItemClasses = (index) => {
    const isVisible = visibleItems.has(index);
    return `transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`;
  };

  return {
    containerRef,
    getItemClasses,
    visibleItems
  };
};

export default useScrollAnimation; 