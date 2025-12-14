import { useEffect, useState } from 'react';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const Logo = ({ variant = 'default', size = 'md', animated = true, className = '' }: LogoProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (variant === 'default') {
      const checkTheme = () => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
      };

      checkTheme();
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });

      return () => observer.disconnect();
    }
  }, [variant]);

  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-20 w-auto'
  };

  const getImgSrc = () => {
    if (variant === 'light') {
      return 'https://cdn.poehali.dev/files/61582.jpg';
    }
    if (variant === 'dark') {
      return 'https://cdn.poehali.dev/files/61582.jpg';
    }
    return 'https://cdn.poehali.dev/files/61582.jpg';
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={getImgSrc()}
        alt="visitka.site"
        className={`${sizeClasses[size]} ${animated ? 'transition-all duration-300 hover:scale-105' : ''}`}
      />
    </div>
  );
};

export default Logo;