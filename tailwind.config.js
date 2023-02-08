
const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  media: false,
  theme: {
    extend: {
      colors: {
          'principal': "#00239c",
          'principal-claro': "#2FC7DF",
          'secundario': '#e4002b',
          'turquesa':'#3cdbc0',
          'amarillo':'#ffb81c',
          'fucsia':'#c721b1',
          'celeste':'#00a9ce',
          'rosa':'#ffb3ab',
          'violeta':'#9063cd',
          'success': '#24B865',
          'success-hover': '#15A253',
          'danger': '#EA3043',
          'danger-hover': '#D4172B',
          'warning': '#ff8200',
          'warning-hover': '#E9B82C',
          'info': '#2E3438',
          'info-hover': '#2FB8E8',
          'whatsapp': '#38c14d',
          gris: {
              'claro': '#f0f3f8',
              'medio': '#a2abb8',
              'oscuro': '#444444',
          }
      },
      fill: {
        current: 'currentColor',
      },
      boxShadow: {
        '3xl': '0 2px 30px -10px rgba(0, 0, 0, 0.3)',
      },
      dropShadow: {
        '4xl': [
          '0 5px 35px rgba(255, 255, 255, 0.65)',
          '0 5px 65px rgba(255, 255, 255, 0.65)'
        ]
      },
    },
  },
  
}
