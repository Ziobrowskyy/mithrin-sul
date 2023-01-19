/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ], theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
        "gradient-animated": "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
      },
      gridTemplateColumns: {
        "carousel": "50px 1fr 50px"
      },
      gridTemplateRows: {
        "carousel": "1fr 30px"
      },
      animation: {
        "fade-out": "fade-out 1s ease-out none",
      },
      keyframes: {
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0.3 },
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
  a: ["a", "b"],
}

// : object-curly-spacing, array-bracket-spacing, computed-property-spacing(space-in-brackets)
