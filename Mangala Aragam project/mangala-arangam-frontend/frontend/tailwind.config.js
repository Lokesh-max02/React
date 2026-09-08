/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        kumkum: {
          DEFAULT: '#7A1B3D',
          dark: '#571029',
          light: '#9C2C4E',
        },
        gold: {
          DEFAULT: '#C9962B',
          light: '#E3B75C',
          dark: '#9C7420',
        },
        ivory: '#FBF6EC',
        parchment: '#F3ECDD',
        leaf: '#46603C',
        stone: '#2A211C',
        blush: '#F3D9DC',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      backgroundImage: {
        arch: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3C/svg%3E\")",
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(42, 33, 28, 0.25)',
        card: '0 6px 24px -8px rgba(122, 27, 61, 0.18)',
      },
      borderRadius: {
        arch: '999px 999px 12px 12px',
      },
    },
  },
  plugins: [],
}
