/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "dk-primary": "#3942C1",
      "dk-secondary": "#999999",
      "dk-faded": "#EFF0FA",
      "dk-background-gray": "#F2F2F2",
      "dk-border-gray": "#CCCCCC",
      "dk-primary-hover": "#21266F",
      "dk-secondary-hover": "#565555",
      "dk-connect-primary": "#EE34A8",
      "dk-body-title": "#666666",
    },
  },
  plugins: [],
}
