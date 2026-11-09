/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matches theprivacyblueprint.co.uk
        sand: '#F6F2EB',
        'sand-2': '#EDE6DA',
        ink: '#1C2B4A',
        navy: '#1C2B4A',
        'navy-deep': '#121D33',
        sage: '#9DBFB9',
        'sage-light': '#C5DAD5',
        'sage-deep': '#4F8279',
        brass: '#B68A4C',
        line: '#D9D2C5',
        'rag-green': '#2D7A4F',
        'rag-green-bg': '#D6EFE1',
        'rag-amber': '#B45309',
        'rag-amber-bg': '#FEF3C7',
        'rag-red': '#B91C1C',
        'rag-red-bg': '#FEE2E2',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        raleway: ['Raleway', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
