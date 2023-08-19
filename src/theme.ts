import { extendTheme, theme } from '@chakra-ui/react';

// import '@fontsource/inter'; // yarn add @fontsource/inter

const overrides = {
  colors: {
    ...theme.colors,
    brand: theme.colors.twitter,
    secondaryBrand: theme.colors.purple,
  }, // main color
  fonts: {
    heading: 'Roboto, -apple-system, system-ui, sans-serif',
    body: 'Roboto, -apple-system, system-ui, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: { Button: { baseStyle: { _focus: { boxShadow: 'none' } } } },
};

export default extendTheme(overrides);
