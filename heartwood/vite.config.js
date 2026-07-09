import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// A cena 3D (src/scene/) está aposentada no design atual do DevWizard,
// mas os arquivos ficam no repositório para um futuro Tabuleiro 3D.
// Nada a importa, então nada dela entra no bundle.
export default defineConfig({
  plugins: [react()],
})
