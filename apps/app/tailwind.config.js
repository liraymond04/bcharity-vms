/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        sidebar: '267px'
      },
      colors: {
        gray: colors.zinc,
        green: colors.emerald,
        purple: colors.violet,
        yellow: colors.yellow,
        brand: colors.violet,
        NavBar: '#23172D',
        SideBar: '#23224A',
        Card: '#18004A',
        Input: '#00254A',
        Within: '#CEBBF8',
        back: '#0f172a',
        front: '#1e254a'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]']
        },
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          'info-content': '#1e1b4b'
        }
      }
    ]
  }
}
