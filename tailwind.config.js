/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './templates/**/*.liquid',
    './layout/**/*.liquid',
    './assets/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        'bx-black':    '#0a0a0a',
        'bx-dark':     '#111111',
        'bx-gray':     '#1a1a1a',
        'bx-muted':    '#6b7280',
        'bx-border':   '#e5e5e5',
        'bx-light':    '#f9f9f9',
        'bx-white':    '#ffffff',
        // Accent — limegroen
        'bx-accent':   '#b5f23d',
        'bx-accent-h': '#9dd62e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem',  { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-lg':  ['3rem',    { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-md':  ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.018em' }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.2',  letterSpacing: '-0.015em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        'screen-2xl': '1440px',
        'screen-3xl': '1600px',
      },
      aspectRatio: {
        '4/3':  '4 / 3',
        '3/2':  '3 / 2',
        '16/9': '16 / 9',
        '21/9': '21 / 9',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      keyframes: {
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-up':    'fade-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'marquee':    'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
