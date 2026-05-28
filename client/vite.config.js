import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // Add this line to allow your specific ngrok domain
        allowedHosts: [
            '.ngrok-free.app'
        ],
    },
})
