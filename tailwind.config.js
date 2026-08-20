/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F3FF',   // Very Soft Purple
          100: '#EDE9FE',  // Soft Purple
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',  // Light Purple
          600: '#7C3AED',
          700: '#6D28D9',  // Primary Purple
          800: '#5B21B6',
          900: '#4C1D95',  // Deep Royal Purple
          950: '#2E1065',
        },
        surface: {
          bg: '#FAFAFC',
          card: '#FFFFFF',
          border: '#E4E4E7',
          muted: '#F4F4F5',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(109, 40, 217, 0.08), 0 8px 10px -6px rgba(109, 40, 217, 0.04)',
        'passport': '0 20px 40px -15px rgba(76, 29, 149, 0.25), 0 0 0 1px rgba(109, 40, 217, 0.1)',
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(109, 40, 217, 0.2), 0 0 10px rgba(109, 40, 217, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(109, 40, 217, 0.5), 0 0 25px rgba(139, 92, 246, 0.3)' },
        }
      }
    },
  },
  plugins: [],
}
