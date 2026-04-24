/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FDFCF8",
        foreground: "#2C2C24",
        primary: {
          DEFAULT: "#5D7052",
          foreground: "#F3F4F1",
        },
        secondary: {
          DEFAULT: "#C18C5D",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#E6DCCD",
          foreground: "#4A4A40",
        },
        muted: {
          DEFAULT: "#F0EBE5",
          foreground: "#78786C",
        },
        border: "#DED8CF",
        destructive: "#A85448",
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'organic': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(93, 112, 82, 0.15)',
        'float': '0 10px 40px -10px rgba(193, 140, 93, 0.2)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        organic: {
          "primary": "#5D7052",
          "secondary": "#C18C5D",
          "accent": "#E6DCCD",
          "neutral": "#F0EBE5",
          "base-100": "#FDFCF8",
          "info": "#3abff8",
          "success": "#36C5B0",
          "warning": "#FBBD23",
          "error": "#A85448",
        },
      },
    ],
  },
}
