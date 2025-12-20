import { useScrollProgress } from '../../hooks/useScrollAnimation';
import './ScrollProgressBar.css';

/**
 * ScrollProgressBar - Shows scroll progress at the top of the page
 * Provides visual feedback for how much of the page has been scrolled
 */
const ScrollProgressBar = () => {
  const progress = useScrollProgress();

  return (
    <div className="scroll-progress-container" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
      <div 
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
