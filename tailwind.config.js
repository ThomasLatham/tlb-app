/* eslint-disable no-undef */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      "primary-light": "#facc15",
      "secondary-light": "#000000",
      "trim-light": "#f1f5f9",
      "side-light": "#FBD53D",
      "back-light": "#f1f5f9",

      "primary-dark": "#1e293b",
      "secondary-dark": "#facc15",
      "trim-dark": "#f1f5f9",
      "side-dark": "#334155",
      "back-dark": "#0f172a",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
