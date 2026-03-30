module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3525cd',
        'primary-light': '#e2dfff',
        'primary-dark': '#3323cc',
        secondary: '#565e74',
        tertiary: '#005338',
        error: '#ba1a1a',
        surface: '#f7f9fb',
        'surface-dim': '#d8dadc',
        'surface-container': '#eceef0',
        'surface-container-low': '#f2f4f6',
        'surface-container-high': '#e6e8ea',
        'surface-bright': '#f7f9fb',
        'on-surface': '#191c1e',
        'on-surface-variant': '#464555',
        border: '#e0e3e5'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px'
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px'
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(53, 37, 205, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
