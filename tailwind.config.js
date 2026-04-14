/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#050A0F", // Abyss Teal
          accent: "#D4AF37",  // Gold Core
          gold: {
            light: "#F9E076",
            core: "#D4AF37",
            dark: "#8A6623",
          },
          depth: "#061A1F",
        },
      },
      fontFamily: {
        heading: ["Bricolage Grotesque", "sans-serif"],
        body: ["Nunito", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
