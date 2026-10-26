/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary Brand Color (#FF5722)
          primary: '#FF5722',
          primaryHover: '#E64A19',
          primarySoft: '#FFF3EE',
          primaryLight: '#FFEBE5',
          orange: '#FF5722',
          orangeHover: '#E64A19',
          orangeSoft: '#FFF3EE',
          orangeLight: '#FFEBE5',

          // Supporting Colors
          ivory: '#FFF8F3', // Warm Ivory
          charcoal: '#252525', // Dark Charcoal
          dark: '#252525',
          darkMuted: '#555555',
          softGray: '#F5F5F5',
          graySoft: '#F5F5F5',
          border: '#EAEAEA',

          // Accent Color
          gold: '#C9A45C', // Muted Gold
          goldHover: '#B58E3C',

          // Seamless compatibility aliases to prevent any leftover pink
          pink: '#FF5722',
          rose: '#E64A19',
          softPink: '#FFF3EE',
          navy: '#252525',
          navyLight: '#323232',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'boutique': '0 4px 20px -2px rgba(255, 87, 34, 0.08)',
        'boutique-lg': '0 10px 30px -4px rgba(255, 87, 34, 0.12)',
        'drawer': '-4px 0 24px rgba(37, 37, 37, 0.18)',
        'orange': '0 4px 16px -2px rgba(255, 87, 34, 0.25)',
      }
    },
  },
  plugins: [],
}
