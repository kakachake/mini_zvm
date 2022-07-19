module.exports = {
  purge: ["./template/**/*.html", "./src/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("tw-elements/dist/plugin")],
};
