import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load the saved theme from localStorage
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    // Apply the theme class to the body element
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    // Save the theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <button onClick={() => setIsDarkMode(!isDarkMode)}>
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
