import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
  fonts: {
    heading: 'Open Sans, sans-serif',
    body: 'Raleway, sans-serif',
  },
});

export default theme;
