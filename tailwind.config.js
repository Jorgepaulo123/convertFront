/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4f46e5', // indigo-600 for light mode
          dark: '#ffffff',  // white for dark mode
        },
        secondary: {
          light: '#4338ca', // indigo-700 for hover in light mode
          dark: '#818cf8',  // indigo-400 for hover in dark mode
        },
        background: {
          light: 'white',
          dark: '#1a1a1a'
        },
        text: {
          light: '#4f46e5', // indigo-600 for light mode
          dark: '#ffffff'   // white for dark mode
        },
        accent: {
          primary: '#7c3aed',
          secondary: '#4f46e5'
        }
      }
    },
  },
  plugins: [],
};
