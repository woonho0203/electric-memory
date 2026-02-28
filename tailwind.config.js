/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <-- 이 부분이 핵심입니다!
  theme: {
    extend: {},
  },
  plugins: [],
}