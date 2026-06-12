/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#15100D',
        coal: '#221A15',
        paper: '#F6EDDC',
        cream: '#E9DCC3',
        faded: '#B5A68C',
        flame: '#FF5126',
        honey: '#FFB627',
        berry: '#E0567E',
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
