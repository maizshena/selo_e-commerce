// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js}", "./public/landingpage.html"], // atau sesuai projectmu
  theme: {
    extend: {},
  },
  plugins: [],
} 
module.exports = {
  theme: {
    extend: {
      colors: {
        // Tambahkan warna kustom di sini
        primary: {
          light: '#B0C4D6', // Warna biru muda
          DEFAULT: '#3b82f6', // Warna biru utama
          dark: '#4F7292', // Warna biru gelap
        },
        secondary: {
          light: '#f9a8d4', // Warna pink muda
          DEFAULT: '#ec4899', // Warna pink utama
          dark: '#9d174d', // Warna pink gelap
        },
        customBrown: '#A57E5E', // Contoh warna abu-abu kustom
        customYellow: '#F3C623',
        customLightRed: '#F77171'
      },
    },
  },
  plugins: [],
};