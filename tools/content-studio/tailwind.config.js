/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#398FBA',
          dark: '#2D7396',
          light: '#E8F2F8',
        },
      },
    },
  },
  plugins: [],
};
