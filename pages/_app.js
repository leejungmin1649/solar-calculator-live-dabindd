import '../styles/globals.css';
import { useEffect, useState } from 'react';

// 공통 레이아웃 컴포넌트
function Layout({ children, toggleTheme, darkMode }) {
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-500">🌞 Solar Profit Calculator</h1>
          <button
            onClick={toggleTheme}
            className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded"
          >
            {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </header>

        <main className="p-4">{children}</main>

        <footer className="text-center p-4 text-xs text-gray-400 border-t dark:border-gray-700">
          © 2025 Dabin ENC | www.dabinenc.com
        </footer>
      </div>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  // 브라우저 설정 따른 초기 테마
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <Layout toggleTheme={toggleTheme} darkMode={darkMode}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
