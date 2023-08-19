import Footer from 'components/footer';
import { BASE_WIDTH } from 'myConstants';

import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  Stack,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';

interface Props {
  children: React.ReactElement;
}

const LoginLayout = ({ children }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const onChangeTheme = () => {
    toggleColorMode();
    const styleEl = document.createElement('style');
    const cssText = document.createTextNode(
      'html * { transition: color, background-color 0.3s ease-out !important }'
    );
    styleEl.appendChild(cssText);
    document.head.appendChild(styleEl);
    setTimeout(() => {
      document.head.removeChild(styleEl);
    }, 300);
  };

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.800')}
      minH="100vh"
      position="relative"
    >
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Stack p={6}>
          <Flex justifyContent="center" zIndex={2}>
            <Box maxW={BASE_WIDTH} w="100%" paddingInline={4}>
              {children}
            </Box>
          </Flex>
        </Stack>
      </Flex>

      <Footer fixedFooter />
      <Tooltip label="Change theme">
        <IconButton
          aria-label=""
          bg="transparent"
          position="absolute"
          top={2}
          right={2}
          icon={
            colorMode === 'light' ? (
              <MoonIcon fontSize={16} color="brand.400" />
            ) : (
              <SunIcon fontSize={16} color="brand.400" />
            )
          }
          onClick={onChangeTheme}
        />
      </Tooltip>
    </Box>
  );
};

export default LoginLayout;
