
import { Flex } from '@chakra-ui/react';

import LoadingSpinner from './loading_spinner';
import Logo from './logo';

const SplashPage = () => (
  <Flex
    minH="100vh"
    display="flex"
    justifyContent="center"
    alignItems="center"
    direction="column"
    gap={8}
  >
    <Logo size={40} />
    <LoadingSpinner size="sm" />
  </Flex>
);

export default SplashPage;
