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
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)'
      }
    }
  },
  plugins: []
};
