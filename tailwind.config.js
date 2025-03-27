/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-light': 'var(--color-primary-light)',
        'secondary-light': 'var(--color-secondary-light)',
        'background-light': 'var(--color-background-light)',
        'primary-dark': 'var(--color-primary-dark)',
        'secondary-dark': 'var(--color-secondary-dark)',
        'background-dark': 'var(--color-background-dark)',
      }
    },
  },
  plugins: [],
};
