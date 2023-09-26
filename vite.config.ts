import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
// import monacoEditorPlugin from "vite-plugin-monaco-editor";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base:"tarsuscloud",
    server: {
        proxy: {
            '/primary': {
                target: 'http://localhost:3401',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/primary/, '')
            },
            '/proxy':{
                target: 'http://localhost:3402',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/proxy/, '')
            }
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    build:{
        outDir:"dist",
    }
})
