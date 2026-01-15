import { useColorScheme } from 'nativewind';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react-native';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const isDark = colorScheme === 'dark';

  return (
    <Button
      onPress={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="h-9 w-9 rounded-full">
      {isDark ? <Sun color="#fafafa" size={20} /> : <Moon color="#0f172a" size={20} />}
    </Button>
  );
}
