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
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        secondary: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          dark: '#EA580C',
        },
        accent: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        background: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          soft: '#334155',
        },
        surface: '#1E293B',
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['InterVariable', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'gradient-slow': 'gradient-move 15s ease infinite',
        'fade-in-up': 'fade-in-up 1s ease-out',
      },
    },
  },
  plugins: [],
};
