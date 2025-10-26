import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from "vite-plugin-eslint"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: true,
	},
	build: {
		target: "esnext",
		chunkSizeWarningLimit: 1024,
	},
	plugins: [
		react(),
// eslintPlugin(),
		VitePWA({
			manifest: {
				name: "My awesome PWA",
				short_name: "PWA",
				description: "A description of my PWA",
				start_url: "/",
				display: "standalone",
				background_color: "#000000",
				theme_color: "#ffffff",
				icons: [
					{
						src: '/logo.svg',
						sizes: '192x192',
						type: 'image/svg+xml'
					},
					{
						src: '/logo.svg',
						sizes: '512x512',
						type: 'image/svg+xml'
					}
				]
			},
			strategies: 'generateSW',
			registerType: 'autoUpdate',
		}),
	],
})
