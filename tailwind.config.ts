import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0D1117',
          900: '#161B22',
          800: '#21262D',
          700: '#30363D',
          600: '#484F58',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        steel: {
          400: '#38BDF8',
          500: '#0EA5E9',
        },
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'amber-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'mesh-dark':
          'radial-gradient(at 20% 20%, rgba(245, 158, 11, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(56, 189, 248, 0.10) 0px, transparent 50%), radial-gradient(at 60% 100%, rgba(245, 158, 11, 0.06) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};

export default config;
