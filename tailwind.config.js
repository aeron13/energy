/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: '#2bb3a0',
        orange: '#ffab00',
        'grey-l20': '#525b67',
        'grey-l70': '#d8dce0',
      }
    },
  },
  plugins: [],
}

