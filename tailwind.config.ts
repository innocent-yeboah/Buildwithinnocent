import type { Config } from "tailwindcss";

/**
 * Tailwind v4 reads most tokens from app/globals.css (@theme).
 * This file documents brand colors and satisfies tooling that expects a config.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F",
        secondary: "#2E7D32",
        accent: "#FFC107",
        "brand-navy": "#1E3A5F",
        "brand-navy-muted": "#172E4C",
        "brand-green": "#2E7D32",
        "brand-green-muted": "#256628",
        "brand-accent": "#FFC107",
      },
    },
  },
};

export default config;
