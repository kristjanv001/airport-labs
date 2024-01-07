/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "almost-white" : "#FFFDFA",
        "dark-blue" : "#00001A",
        "yellow" : "#E9AA52"
      }
    },
  },
  plugins: [],
}

