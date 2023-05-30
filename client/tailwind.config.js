/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      primary: ['"Poppins"', 'sans-serif'],
      secondary: ['"Roboto"', 'sans-serif']
    },
    extend: {
      spacing: {
        '128': '36rem'
      }
    },
  },
  plugins: [],
}

