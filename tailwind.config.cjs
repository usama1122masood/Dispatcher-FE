

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for sidebar (optional)
        primary: {
          light: '#3c7dbb',
          dark: '#094a88',
          DEFAULT:"#C1DFFB"
        },
        sidebar: {
          light: '#1a1f2e',
          dark: '#111827',
        },
        warning:"#D48806",
        danger:"#FF4D4F",
        success:"#52C41A",
        background:{
          light:"#1f1f1f",
          dark:"#1f2937",
          DEFAULT:"#141414"
        }
      },
      transitionDuration: {
        // Custom transition durations (optional)
        '250': '250ms',
      },
    },
  },
  plugins: [],
}