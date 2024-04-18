/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Halcom: ["Halcom", "sans-serif"],
        Raleway: ["Raleway", "sans-serif"],
        Flegrei: ["flegrei", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#a2cefe",
          200: "#6cacfc",
          300: "#609dfb",
          400: "#5b8fec",
          500: "#444ca5",
          600: "#141631",
        },
        secondary: {
          100: "#c4ddcd",
          200: "#84b192",
          300: "#689070",
          400: "#56735a",
          500: "#3c473b",
        },
        light: {
          100: "#fafafa",
          200: "#dedede",
          300: "#c2c2c2",
          400: "#818181",
          500: "#3c3c3c",
        },
        dark: {
          100: "#E0E0E0",
          200: "#9E9E9E",
          300: "#616161",
          400: "#424242",
          500: "#0D0D0D",
        },
        accent: "#79D0F2",
        danger: "#e45141",
      },
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-15": "span 15 / span 15",
        "span-13": "span 13 / span 13",
      },
      keyframes: {
        SMOOTH: {
          "0%, 100%": { transform: "translateYY(-.2rem)" },
          "50%": { transform: "translateY(.2rem)" },
        },
        SMOOTH2: {
          "0%, 100%": { transform: "translateYY(-.3rem)" },
          "50%": { transform: "translateY(.3rem)" },
        },
        revealLine: {
          to: { width: "100%" },
        },
        gradientReveal: {
          "0% 100%": {
            backgroundPosition: "0% 100%",
          },
          "50%": {
            backgroundPosition: " 100% 0%",
          },
        },
      },
      animation: {
        revealLine: "revealLine 5s linear forwards",
        smooth: "SMOOTH 1s ease-in-out normal",
        smooth2: "SMOOTH2 1s ease-in-out normal",
        gradientReveal: "gradientReveal 2s linear infinite",
      },
    },
  },
  plugins: [],
};
