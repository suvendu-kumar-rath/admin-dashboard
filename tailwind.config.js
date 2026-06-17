/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#080605',
        'bg-secondary': '#050505',
        'bg-tertiary': '#15100d',
        'text-muted': '#a0a0a0',
        'accent-orange': '#ff7a00',
      },
    },
  },
  plugins: [],
}
