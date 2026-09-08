/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Figtree', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#398FBA',
          bright: '#5FB6DE',
          deep: '#2a6d94',
        },
        ink: {
          DEFAULT: '#0C1319',
          soft: '#141F27',
          line: '#22323D',
        },
      },
    },
  },
  plugins: [],
};
