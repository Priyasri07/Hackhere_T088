/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finance: {
          bg: '#080d1a',
          surface: '#0d1527',
          surface2: '#131e36',
          surface3: '#1a2948',
          border: 'rgba(255, 255, 255, 0.08)',
          borderFocus: 'rgba(56, 189, 248, 0.4)',
          text: '#f1f5f9',
          muted: '#94a3b8',
          subtle: '#64748b',
          cyan: '#38bdf8',
          blue: '#3b82f6',
          green: '#10b981',
          greenLight: 'rgba(16, 185, 129, 0.15)',
          red: '#ef4444',
          redLight: 'rgba(239, 68, 68, 0.15)',
          amber: '#f59e0b',
          amberLight: 'rgba(245, 158, 11, 0.15)',
          purple: '#a855f7',
          purpleLight: 'rgba(168, 85, 247, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(56, 189, 248, 0.25)',
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.25)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
