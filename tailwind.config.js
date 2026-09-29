/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './sections/*.fragment',
    './*.js',
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FFFBF5',
          surface: '#FFF8F0',
          white: '#FFFFFF',
          border: '#E7E5E4',
          'border-subtle': '#F5F0EB',
          muted: '#78716C',
          body: '#44403C',
          dark: '#292524',
        },
        brand: {
          blue: '#007BFF',
          'blue-hover': '#0056CC',
          'blue-light': '#DBEAFE',
          amber: '#F59E0B',
          'amber-light': '#FEF3C7',
          coral: '#F97316',
          success: '#10B981',
          danger: '#EF4444',
          info: '#38BDF8',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Hanken Grotesk"', 'sans-serif'],
        display: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: { site: '1280px' },
      borderRadius: { sm: '4px', md: '8px', lg: '12px' },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
