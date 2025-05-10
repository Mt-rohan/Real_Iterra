// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C5DD3',
          light: '#8E7AEF',
          dark: '#4A3ABF',
        },
        secondary: {
          DEFAULT: '#FF6F61',
          light: '#FF8A7A',
          dark: '#D94E48',
        },
        accent: {
          DEFAULT: '#4FB6C7',
          light: '#75D1DB',
          dark: '#2395A2',
        },
        background: {
          light: '#F7F8FD',
          DEFAULT: '#FFFFFF',
        },
        surface: '#FFFFFF',
        text: {
          primary: '#1F2937',
          secondary: '#4B5563',
        },
      },
      fontFamily: {
        sans: ['"InterVariable"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
