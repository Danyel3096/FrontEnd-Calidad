/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Asegúrate de que sea 'class'
    content: ["./src/**/*.{html,ts}"],
    theme: {
      extend: {
        colors:{
          light: '#F9FAFB',
          dark: '#111827',
        },
      },
    },
    plugins: [],
  };