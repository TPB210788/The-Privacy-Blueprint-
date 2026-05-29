/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0EB',
        charcoal: '#2C2C2C',
        'warm-brown': '#8B7355',
        'warm-brown-light': '#A0896A',
        'warm-brown-dark': '#6B5840',
        'rag-green': '#2D7A4F',
        'rag-green-bg': '#D6EFE1',
        'rag-amber': '#B45309',
        'rag-amber-bg': '#FEF3C7',
        'rag-red': '#B91C1C',
        'rag-red-bg': '#FEE2E2',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
