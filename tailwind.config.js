/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tactical: {
          bg: '#090C0A',
          card: '#111714',
          border: '#233029',
          olive: '#2D4236',
          oliveLight: '#4A6B58',
          gold: '#D4AF37',
          goldLight: '#F3C64F',
          text: '#F4F6F5',
          muted: '#94A39B'
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
