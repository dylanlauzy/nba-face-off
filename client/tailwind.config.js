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
      },
      backgroundImage: {
        'hero': "url('assets/background.jpeg')",
      },
      colors: {
        'ATL': '#e03a3e',
        'BOS': '#008348',
        'CLE': '#6f263d',
        'MIA': '#98002e',
        'OKC': '#ef3b24',
        'GSW': '#fdb927',
        'HOU': '#ce1141',
        'BKN': '#aaaaaa',
        'CHA': '#00788c',
        'CHI': '#ce1141',
        'DAL': '#0053bc',
        'DEN': '#0e2240',
        'DET': '#1d428a',
        'IND': '#002d62',
        'LAC': '#c8102e',
        'LAL': '#552583',
        'MEM': '#5d76a9',
        'MIL': '#eee1c6',
        'MIN': '#0c2340',
        'NOP': '#b4975a',
        'NYK': '#f58426',
        'ORL': '#0077c0',
        'PHI': '#006bb6',
        'PHX': '#1d1160',
        'POR': '#e03a3e',
        'SAC': '#5a2b81',
        'SAS': '#c4ced4',
        'TOR': '#ce1141',
        'UTA': '#f9a01b',
        'WAS': '#002b5c'
      },
    },
  },
  plugins: [],
}

