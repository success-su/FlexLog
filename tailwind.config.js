/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dark-mode surface/border/muted-text scale — a cool graphite tint
        // instead of flat gray, used behind `dark:` variants.
        ink: {
          950: "#0a0a10",
          900: "#141419",
          800: "#1e1e26",
          700: "#302f3a",
          600: "#48475a",
          500: "#6b6a7a",
          400: "#8e8d9c",
          300: "#b3b2bf",
          200: "#d8d7e0",
          100: "#efeef3",
        },
        // Light-mode counterpart to `ink` — same cool graphite undertone,
        // lifted to light values, so both themes share one color language
        // instead of light mode staying flat/stock-gray.
        mist: {
          50: "#f9f9fc",
          100: "#f1f1f6",
          200: "#e3e3ea",
          300: "#cbcbd6",
          400: "#9d9dae",
          500: "#75758a",
          600: "#5c5c6e",
          700: "#454555",
          800: "#2e2e3a",
          900: "#18181f",
        },
      },
    },
  },
  plugins: [],
};
