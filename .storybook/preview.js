export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'Dark',
    values: [
      {
        name: 'Light',
        value: '#eee'
      },
      {
        name: 'Dark',
        value: 'rgb(29, 32, 36)'
      }
    ]
  },
}