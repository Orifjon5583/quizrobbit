/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: { soft: "0 20px 60px -20px rgba(15, 23, 42, .22)" },
      animation: { "fade-in": "fadeIn .35s ease-out" },
      keyframes: { fadeIn: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } } },
    },
  },
  plugins: [],
};
