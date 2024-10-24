import 'dotenv/config'
import { defineConfig, loadEnv, searchForWorkspaceRoot, type UserConfig } from 'vite'
import glob from 'fast-glob'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

// Convert import.meta.url to a file path and then get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command, mode }): UserConfig => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    const host = process.env.VITE_HOST || 'localhost'; // Default to 'localhost'
    const port = parseInt(process.env.VITE_PORT || '3000'); // Default to 3000
    const protocol = process.env.VITE_PROTOCOL === 'https' ? 'https' : 'http'; // Default to 'http'

    console.log(searchForWorkspaceRoot(process.cwd()))

    return {
        root: 'src',
        build: {
            outDir: '../www',
            manifest: true,
            emptyOutDir: true,
            rollupOptions: {
                input: Object.fromEntries(
                    glob.sync(['./src/*.html', './src/components/**/*.ts']).map((file) => {
                        return [
                            path.relative(__dirname, file.slice(0, file.length - path.extname(file).length)),
                            fileURLToPath(new URL(file, import.meta.url))
                        ]
                    })
                ),
            },
        },
    }
})
