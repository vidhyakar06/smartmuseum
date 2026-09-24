/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        museum: {
          bg: '#0B0D10',
          surface: '#15181D',
          elevated: '#1E232B',
          border: '#2A303C',
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          'gold-dark': '#A9861E',
          cyan: '#38BDF8',
          'cyan-dark': '#0284C7',
          text: '#F8FAFC',
          muted: '#94A3B8',
          subtle: '#64748B',
          alert: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'cyan-glow': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
