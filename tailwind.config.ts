import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { boxShadow: { glow: "0 0 60px rgba(99,102,241,.18)" } } },
  plugins: []
};
export default config;