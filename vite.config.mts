import { defineConfig } from 'weapp-vite/config'
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'

export default defineConfig({
  weapp: {
    // weapp-vite options
  },
  plugins: [
    uvwt({
      rem2rpx: true,
    }),
  ],
})
