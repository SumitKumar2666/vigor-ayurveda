import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        sage: {
          50: '#f6f8f6',
          100: '#e3ede3',
          200: '#c7dbc7',
          300: '#9dc19d',
          400: '#6fa16f',
          500: '#4a7c4a',
          600: '#3a633a',
          700: '#2f4f2f',
          800: '#274027',
          900: '#223622',
        },
        turmeric: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        earth: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dcc9',
          300: '#d4bfa0',
          400: '#bc9b70',
          500: '#a47d4f',
          600: '#8b6643',
          700: '#735239',
          800: '#5e4432',
          900: '#4e392b',
        },
        terracotta: {
          50: '#fef6f3',
          100: '#fceae3',
          200: '#f9d4c6',
          300: '#f4b49d',
          400: '#ec8a6b',
          500: '#e26744',
          600: '#cf4d2c',
          700: '#ad3d22',
          800: '#8f3520',
          900: '#772f20',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(74, 124, 74, 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config;