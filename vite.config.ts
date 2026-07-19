import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/bonoan_enterprises_cost_estimator.io/',
  plugins: [react()],
})
