/* eslint-disable no-undef */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              // eslint-disable-next-line quotes
              content: '""',
            },
            "code::after": {
              // eslint-disable-next-line quotes
              content: '""',
            },
          },
        },
      },
    },
    colors: {
      "primary-light": "#FEAA00",
      "secondary-light": "#000000",
      "trim-light": "#f1f5f9",
      "side-light": "#d37e36",
      "back-light": "#e2e8f0",

      "primary-dark": "#0b1925",
      "secondary-dark": "#FEAA00",
      "trim-dark": "#e2e8f0",
      "side-dark": "#505864",
      "back-dark": "#0f172a",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
