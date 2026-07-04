import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Expense Tracker",
        short_name: "Expense",
        description: "Expense Tracking Application",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/expenseTracker/",
        icons: [
          {
            src: "./src/assets/expenses.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./src/assets/expenses.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })],
  base: '/expenseTracker/'
})
