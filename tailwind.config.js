/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bracket: {
          bg: '#1a2e1a',
          card: '#2d4a2d',
          accent: '#ff6b35',
          highlight: '#3d5a3d',
          gold: '#f7b32b',
        }
      }
    },
  },
  plugins: [],
}
