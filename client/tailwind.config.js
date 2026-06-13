/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens — values live in index.css (:root = dark, .light = light)
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        coal: 'rgb(var(--c-coal) / <alpha-value>)',
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        faded: 'rgb(var(--c-faded) / <alpha-value>)',
        flame: 'rgb(var(--c-flame) / <alpha-value>)',
        honey: 'rgb(var(--c-honey) / <alpha-value>)',
        berry: 'rgb(var(--c-berry) / <alpha-value>)',
        // Fixed "physical" colors — paper artifacts look the same in both themes
        cream: '#ece1c8',
        carbon: '#15100D',
        milk: '#F6EDDC',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        accent: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      boxShadow: {
        sticker: '4px 4px 0 0 #15100D',
        'sticker-paper': '4px 4px 0 0 rgba(246,237,220,0.9)',
        lifted: '0 24px 50px -12px rgba(0,0,0,0.6)',
        elevated: '0 16px 34px -16px rgba(0,0,0,0.62)',
        glow: '0 18px 50px -16px rgba(255,81,38,0.55)',
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        heartbeat: 'heartbeat 1.6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease both',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.18)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.18)' },
          '70%': { transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
