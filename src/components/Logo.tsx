interface LogoProps {
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo = ({ variant = 'default', size = 'md', showText = true, className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const getColors = () => {
    switch (variant) {
      case 'white':
        return { primary: '#FFFFFF', secondary: '#F5F5F5', accent: '#FFD700' };
      case 'dark':
        return { primary: '#000000', secondary: '#1A1A1A', accent: '#FFD700' };
      default:
        return { primary: '#FFD700', secondary: '#000000', accent: '#FFFFFF' };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* SVG Logo */}
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Infinity Symbol with Number 7 */}
        <path
          d="M10 20C10 16 12 14 15 14C18 14 20 16 20 20C20 24 22 26 25 26C28 26 30 24 30 20C30 16 28 14 25 14C22 14 20 16 20 20C20 24 18 26 15 26C12 26 10 24 10 20Z"
          fill={colors.primary}
        />
        {/* Number 7 */}
        <path
          d="M32 12H38L32 28H28L32 12Z"
          fill={colors.accent}
          fontWeight="bold"
        />
        {/* Circle outline */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke={colors.primary}
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
      </svg>

      {/* Text */}
      {showText && (
        <div className={`font-bold ${textSizeClasses[size]}`}>
          <span style={{ color: colors.primary }}>visitka</span>
          <span style={{ color: colors.accent }}>.site</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
