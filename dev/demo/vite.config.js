import Path from "path"
import { defineConfig } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh()],
    resolve: {
        alias: {
            "@": Path.resolve(__dirname, "src"),
            "@lib": Path.resolve(__dirname, "../.."),
            "@components": Path.resolve(__dirname, "src/components"),
        },
    },
})
