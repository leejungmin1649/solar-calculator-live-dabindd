'use client'; // ✅ Next.js 13+ App Router 사용 시 클라이언트 컴포넌트 선언

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
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
