module.exports = {
  purge: [
    '../**.php',
    '../**/**.php',
    '../**/**.js',
    '../**/**/**.js'
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    "colors": {
      "theme ": {
        "white": "#ffffff",
        "dark-gray": "#333333",
        "black": "#000000"
      },
      "function ": {
        "error": "#ff403c",
        "succes": "#87e12c",
        "input": "#252525",
        "links": "#2d9cdb"
      }
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",      
      "base": "1rem",
      "lg": "1.25rem",
      "xl": "1.5rem",
      "2xl": "2rem",
      "3xl": "2.75rem",
      "4xl": "4.375rem",
      "5xl": "6.25rem",
      "6xl": "9.375rem",
    },
    "fontFamily": {
      "sans": "Avenir",
      "heading": "Aeroport"
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-debug-screens')
  ],
}
