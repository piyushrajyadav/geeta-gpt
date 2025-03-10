/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'divine-blue': 'var(--divine-blue)',
        'divine-gold': 'var(--divine-gold)',
        'divine-saffron': 'var(--divine-saffron)',
        'divine-white': 'var(--divine-white)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            a: {
              color: 'var(--divine-blue)',
              '&:hover': {
                color: 'var(--divine-saffron)',
              },
            },
            h1: {
              color: 'var(--divine-blue)',
            },
            h2: {
              color: 'var(--divine-blue)',
            },
            h3: {
              color: 'var(--divine-blue)',
            },
            blockquote: {
              borderLeftColor: 'var(--divine-gold)',
              color: 'var(--accent)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 