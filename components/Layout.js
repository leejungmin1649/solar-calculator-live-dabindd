import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <header className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="text-lg font-bold text-emerald-500">☀️ SolarCalc</div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <Link href="/about" className="hover:text-emerald-400">About</Link>
            <Link href="/contact" className="hover:text-emerald-400">Contact</Link>
            <button onClick={toggleTheme} className="text-sm">
              {darkMode ? '🌙' : '☀️'}
            </button>
          </nav>
          <div className="md:hidden flex items-center space-x-3">
            <button onClick={toggleTheme}>{darkMode ? '🌙' : '☀️'}</button>
            <button onClick={toggleMenu} className="text-xl">☰</button>
          </div>
        </header>
        {menuOpen && (
          <div className="md:hidden bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 space-y-2">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link><br />
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link><br />
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}
        <main className="p-4">{children}</main>
        <footer className="text-center p-4 text-xs text-gray-500 border-t dark:border-gray-700">
          © 2025 Dabin ENC | www.dabinenc.com
        </footer>
      </div>
    </div>
  );
}