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
          primary: "#050A0F", // Abyss Teal (Background/Primary Theme)
          accent: "#FFD700",  // Gold (Secondary/Accent)
          muted: "#C9A055",   // Muted Gold
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
