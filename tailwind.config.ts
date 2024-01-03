import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      boxShadow: {
        movie: "0px 5px 10px 0px rgba(0, 0, 0, 0.50);",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
export default config;
