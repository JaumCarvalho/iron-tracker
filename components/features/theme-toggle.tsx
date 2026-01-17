import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react-native';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);

  const isDark = colorScheme === 'dark';

  const handleToggle = () => {
    setIsLoading(true);

    setTimeout(() => {
      toggleColorScheme();

      setTimeout(() => {
        setIsLoading(false);
      }, 50);
    }, 10);
  };

  return (
    <Button
      onPress={handleToggle}
      size="icon"
      variant="ghost"
      disabled={isLoading}
      className="h-9 w-9 rounded-full">
      {isLoading ? (
        <ActivityIndicator size="small" color={isDark ? '#fafafa' : '#0f172a'} />
      ) : isDark ? (
        <Sun color="#fafafa" size={20} />
      ) : (
        <Moon color="#0f172a" size={20} />
      )}
    </Button>
  );
}
