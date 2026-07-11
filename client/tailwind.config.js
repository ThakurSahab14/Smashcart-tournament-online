/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: {
          DEFAULT: "#0B0E14",
          light: "#12161F",
          lighter: "#1B212D",
        },
        volt: "#00E5FF",
        surge: "#FF2E92",
        gold: "#FFC93C",
        silver: "#C9D6DF",
        bronze: "#D98C4A",
      },
      fontFamily: {
        display: ["'Rajdhani'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        checker:
          "linear-gradient(45deg, #1B212D 25%, transparent 25%, transparent 75%, #1B212D 75%, #1B212D), linear-gradient(45deg, #1B212D 25%, transparent 25%, transparent 75%, #1B212D 75%, #1B212D)",
      },
      keyframes: {
        driveIn: {
          "0%": { transform: "translateX(-120vw) rotate(-2deg)" },
          "70%": { transform: "translateX(6vw) rotate(1deg)" },
          "85%": { transform: "translateX(-2vw) rotate(-0.5deg)" },
          "100%": { transform: "translateX(0) rotate(0deg)" },
        },
        trail: {
          "0%": { opacity: 0, width: "0%" },
          "100%": { opacity: 1, width: "100%" },
        },
        flicker: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      },
      animation: {
        driveIn: "driveIn 1.4s cubic-bezier(.2,.8,.2,1) forwards",
        trail: "trail 1.4s ease-out forwards",
        flicker: "flicker 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
