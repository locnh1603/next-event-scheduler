'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './shadcn-ui/select';
import { toast } from 'sonner';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'blue', label: 'Blue' },
    { value: 'dark-blue', label: 'Dark Blue' },
  ];
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  const onThemeChange = (value: string) => {
    const themeName = themes.find((t) => t.value === value)?.label;
    toast.success('Theme changed to ' + themeName);
    setTheme(value);
  };
  return (
    <Select defaultValue="light" value={theme} onValueChange={onThemeChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((t) => (
          <SelectItem key={t.value} value={t.value}>
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ThemeSwitcher;
