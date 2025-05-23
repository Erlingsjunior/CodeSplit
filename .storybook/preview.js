import '../src/app/globals.css'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered',
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: '#1a1a1a',
      },
      {
        name: 'light',
        value: '#ffffff',
      },
    ],
  },
}

export const globalTypes = {
  theme: {
    description: 'Global theme for components',
    defaultValue: 'dark',
    toolbar: {
      title: 'Theme',
      icon: 'paintbrush',
      items: ['light', 'dark'],
      dynamicTitle: true,
    },
  },
}