/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary:     "rgb(var(--color-primary-rgb) / <alpha-value>)",
        secondary:   "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        accent:      "rgb(var(--color-accent-rgb) / <alpha-value>)",
        canvas:      "rgb(var(--color-canvas-rgb) / <alpha-value>)",
        surface:     "rgb(var(--color-canvas-rgb) / <alpha-value>)",
        "surface-alt":"rgb(var(--color-accent-rgb) / <alpha-value>)",
        panel:       "rgb(var(--color-primary-rgb) / <alpha-value>)",
        text:        "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "text-muted":"rgb(var(--color-primary-rgb) / <alpha-value>)",
        "text-inverse":"rgb(var(--color-canvas-rgb) / <alpha-value>)",
        border:      "rgb(var(--color-primary-rgb) / <alpha-value>)",
        cta:         "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        "accent-soft":"rgb(var(--color-accent-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans:    ['"Inter"', 'sans-serif'],
      },
      animation: {
        "fade-up":    "fadeUp .6s ease both",
        "fade-in":    "fadeIn .8s ease both",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "ticker":     "ticker 20s linear infinite",
        "shimmer":    "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeUp:   { "0%": { opacity: 0, transform: "translateY(30px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:   { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        pulseGlow:{ "0%,100%": { boxShadow: "0 0 20px rgba(185,145,95,.4)" }, "50%": { boxShadow: "0 0 45px rgba(185,145,95,.8)" } },
        ticker:   { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        shimmer:  { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
