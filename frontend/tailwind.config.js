/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",   // slate-900
        surface: "#020617",      // slate-950
        primary: "#3b82f6",      // blue-500
        primaryHover: "#2563eb", // blue-600
        text: "#e5e7eb",         // gray-200
        muted: "#94a3b8",        // slate-400
      },
    },
  },
  plugins: [],
};
