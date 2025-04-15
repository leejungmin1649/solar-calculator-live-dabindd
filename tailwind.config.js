/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ 다크모드를 클래스 기반으로 사용
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',     // 페이지 폴더 내부
    './components/**/*.{js,ts,jsx,tsx}' // 컴포넌트 폴더 내부
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: '#34D399',
        },
        violet: {
          400: '#818CF8',
        },
      },
    },
  },
  plugins: [],
};
