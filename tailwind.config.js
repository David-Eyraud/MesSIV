/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F15A24',
          50: '#FEF2ED',
          100: '#FDE4DB',
          200: '#FBC9B6',
          300: '#F9AE91',
          400: '#F7936C',
          500: '#F15A24',
          600: '#D14316',
          700: '#A33511',
          800: '#75260C',
          900: '#471707',
        },
      },
    },
  },
  plugins: [],
};