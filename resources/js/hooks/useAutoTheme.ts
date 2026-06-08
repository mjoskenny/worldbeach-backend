import { useEffect } from 'react';

export const useAutoTheme = () => {
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      
      // Day time: 6 AM to 6 PM (light mode)
      // Night time: 6 PM to 6 AM (dark mode)
      const isDayTime = hour >= 6 && hour < 18;
      
      if (isDayTime) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    };

    // Update theme immediately
    updateTheme();

    // Check every minute for theme changes
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);
};
