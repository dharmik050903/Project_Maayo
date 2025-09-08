/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],

  theme: {
    extend: {
      colors: {
        primary: '#173257',
        violet: '#7635FF',
        coral: '#FF5A69',
        mint: '#23D1A4',
        base: '#F6F6FB',
        graphite: '#252525',
        coolgray: '#8B94A6',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(23, 50, 87, 0.08)',
      },
      borderRadius: {
        xl: '14px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #173257 0%, #7635FF 100%)',
      },
    },
  },
  plugins: [],
}


