import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "/tech_web_lab6/",
  plugins: [tailwindcss()],
});