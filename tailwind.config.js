/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['GentiumBookW', 'Georgia', 'serif'],
        sans: ['GentiumBookW', 'Georgia', 'serif'],
      }
    }
  },
  plugins: [],
}
