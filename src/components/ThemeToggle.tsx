import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-full"
      aria-label="Переключить тему"
    >
      {theme === 'light' ? (
        <Icon name="Moon" size={18} className="transition-transform duration-300" />
      ) : (
        <Icon name="Sun" size={18} className="transition-transform duration-300" />
      )}
    </Button>
  );
};

export default ThemeToggle;
