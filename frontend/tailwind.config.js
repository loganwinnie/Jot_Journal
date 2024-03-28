/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        "Halcom": ["Halcom", "sans-serif"],
        "Raleway": ["Raleway", "sans-serif"]
      },
      colors: {
        "primary": {
          100: "#c8d5ed",
          200: "#8d9cbc",
          300: "#607297",
          400: "#323f59",
          500: "#1f2b41"
        },
        "secondary": {
          100: "#c4ddcd",
          200: "#84b192",
          300: "#689070",
          400: "#56735a",
          500: "#3c473b",
        },
        "light": {
          100: "#fafafa",
          200: "#dedede",
          300: "#c2c2c2",
          400: "#818181",
          500: "#3c3c3c",
        },
        "dark": {
          100: "#E0E0E0",
          200: "#9E9E9E",
          300: "#616161",
          400: "#424242",
          500: "#0D0D0D",
        }
      }
    },
  },
  plugins: [],
}

