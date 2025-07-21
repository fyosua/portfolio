/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
          foreground: 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)', // <-- ADD THIS LINE
      },
      fontFamily: {
        // Example: add Shadcn's font stack, fallback to Tailwind's default
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      // You can add more Shadcn UI theme extensions here if needed
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Shadcn UI recommends this for transitions
    // require('@tailwindcss/typography'), // Optional: for prose/markdown
    // require('@tailwindcss/forms'),      // Optional: for better form styles
  ],
};

module.exports = config;