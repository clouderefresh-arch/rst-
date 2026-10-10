import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f19",
      },
      boxShadow: {
        card: "0 24px 60px -28px rgba(11, 15, 25, 0.55)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        float: "float 6.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
