import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#152248",     // Dark blue
        secondary: "#3052a8",   // Medium blue
        ternary: "#7f99bf",     // Light blue
        background: "#ffffff",  // White
        foreground: "#000000",  // Black
        ubc: "#002145",         // Official UBC blue 
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],

} satisfies Config;
