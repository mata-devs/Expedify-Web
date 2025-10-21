import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        expedify: {
          gold: "#f5b301",
          dark: "#3b3516",
        },
      },
    },
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
} satisfies Config;
