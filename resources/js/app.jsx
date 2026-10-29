import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

// Inisialisasi aplikasi Inertia.js + React
createInertiaApp({
  // Resolve halaman dari folder pages/
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
    const page = pages[`./pages/${name}.tsx`]
    if (!page) {
      throw new Error(`Halaman tidak ditemukan: ${name}`)
    }
    return page
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },

  progress: {
    color: '#4299E1',
  },
})

