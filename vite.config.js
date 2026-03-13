import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "إدارة الحانوت - Hanouti",
        short_name: "Hanouti",
        start_url: "/",
        display: "standalone",
        background_color: "#f4f7f9",
        theme_color: "#0ea5e9",
        icons: [
          {
            src: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
})