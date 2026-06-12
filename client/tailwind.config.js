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
        cream: '#E9DCC3',
        carbon: '#15100D',
        milk: '#F6EDDC',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sticker: '4px 4px 0 0 #15100D',
        'sticker-paper': '4px 4px 0 0 rgba(246,237,220,0.9)',
        lifted: '0 24px 50px -12px rgba(0,0,0,0.6)',
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'float-slower': 'float 9s ease-in-out infinite',
        pop: 'pop 0.4s cubic-bezier(0.2, 1.6, 0.4, 1) both',
        'fade-up': 'fadeUp 0.5s ease both',
        heartbeat: 'heartbeat 1.6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--rot, 0deg))' },
          '50%': { transform: 'translateY(-14px) rotate(var(--rot, 0deg))' },
        },
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.18)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.18)' },
          '70%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
