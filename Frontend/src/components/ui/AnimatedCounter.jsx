import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * AnimatedCounter - Animates numbers counting up when visible
 * Provides a smooth, professional counting animation effect
 * 
 * @param {Object} props
 * @param {number|string} props.end - Target number to count to
 * @param {number} props.duration - Animation duration in ms (default 2000)
 * @param {string} props.prefix - Text to show before number
 * @param {string} props.suffix - Text to show after number (e.g., "+", "K", "%")
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.startOnVisible - Start animation when visible (default true)
 */
const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  className = '',
  startOnVisible = true 
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);
  const endValue = typeof end === 'string' ? parseFloat(end.replace(/[^0-9.]/g, '')) : end;

  useEffect(() => {
    if (!startOnVisible) {
      animateCount();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          animateCount();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnVisible]);

  const animateCount = () => {
    const startTime = Date.now();
    const startValue = 0;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easedProgress);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(updateCount);
  };

  // Format number with commas for large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toLocaleString();
  };

  // Determine if we should use K/M formatting based on the end value string
  const shouldFormat = typeof end === 'string' && (end.includes('K') || end.includes('M'));
  const displayValue = shouldFormat ? formatNumber(count) : count.toLocaleString();

  return (
    <span ref={ref} className={`animated-counter ${className}`}>
      {prefix}{displayValue}{!shouldFormat && suffix}
    </span>
  );
};

AnimatedCounter.propTypes = {
  end: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  duration: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  className: PropTypes.string,
  startOnVisible: PropTypes.bool
};

export default AnimatedCounter;
