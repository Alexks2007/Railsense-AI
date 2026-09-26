/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        railway: {
          dark: '#090D14',
          panel: '#0F1522',
          panelBorder: '#1E2B3E',
          steel: '#334155',
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
          violet: '#8B5CF6'
        }
      }
    }
  },
  plugins: []
};
