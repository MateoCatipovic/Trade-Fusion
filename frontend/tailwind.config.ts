import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundPosition: {
        'top-neg-50px': 'center top -120px',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "sign-in": "url('/bull_loginHD.png')",
        "sign-up": "url('/bear_registerHD.png')",
        "home": "url('/bg-landing.png')",
        "four-sided-gradient":
          "linear-gradient(to top, transparent,  rgba(0, 0, 0, 0.5)), " +
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent), " +
          "linear-gradient(to left, rgba(0, 0, 0, 0.7), transparent), " +
          "linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
export default config;
