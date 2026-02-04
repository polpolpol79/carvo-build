/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}" // Scan all files in root as well since structure is flat
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
