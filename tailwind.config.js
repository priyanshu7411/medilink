/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        medical: {
          primary: '#2563eb',
          secondary: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['"TWK Everett"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
