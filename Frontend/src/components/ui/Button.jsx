import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ children, variant = 'primary', size = 'medium', onClick, disabled, className = '' }) => {
  const sizeMap = {
    small: 'sm',
    medium: 'md',
    large: 'lg'
  };
  
  return (
    <button
      className={`gaming-btn gaming-btn--${variant} gaming-btn--${sizeMap[size]} ${className} cursor-target`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
