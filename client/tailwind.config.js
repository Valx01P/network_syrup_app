/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bungee: ['"Bungee Inline"', 'cursive'],
        cabin: ['"Cabin Sketch"', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],      }
    },
  },
  plugins: [],
}