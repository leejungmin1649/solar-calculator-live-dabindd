'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  // 최초 로드 시 로컬스토리지에서 설정 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // 다크모드 상태 변경 시 HTML 클래스 & 로컬스토리지 저장
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500 dark:bg-white dark:text-gray-900"
      >
        {darkMode ? '라이트 모드' : '다크 모드'}
      </button>
    </div>
  );
}
