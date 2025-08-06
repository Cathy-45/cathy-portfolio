import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: "127.0.0.1", // Ensure compatibility with VS Code port forwarding
    port: 5173,
  },
});
