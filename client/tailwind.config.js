/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Adding a luxury dark theme palette for your music player
                playerBg: '#090d16',
                cardBg: 'rgba(255, 255, 255, 0.03)',
                accent: '#3b82f6', // sleek blue, swap to whatever you like later
            }
        },
    },
    plugins: [],
}
