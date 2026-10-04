import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    svelte()
  ],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/references/**']
    }
  },
  optimizeDeps: {
    // 明确限定 Vite 依赖预构建扫描范围，排除外部 references 参考素材目录
    entries: [
      'index.html',
      'src/**/*.{ts,svelte}'
    ]
  }
})
