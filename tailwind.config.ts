/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'hologram': 'hologram 2s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'particle-float': 'particle-float 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 30px rgba(139, 92, 246, 0.6)' },
        },
        hologram: {
          '0%, 100%': { opacity: '0.8', transform: 'translateY(0px)' },
          '50%': { opacity: '1', transform: 'translateY(-2px)' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'particle-float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: '0.3' },
          '25%': { transform: 'translateY(-5px) translateX(5px)', opacity: '0.8' },
          '50%': { transform: 'translateY(-10px) translateX(0px)', opacity: '1' },
          '75%': { transform: 'translateY(-5px) translateX(-5px)', opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
