import Footer from 'components/footer';
import ScrollToTop from 'components/go_to_top';
import Nav from 'components/nav';
import { BASE_WIDTH, FOOTER_HEIGHT } from 'myConstants';
import { useEffect } from 'react';

import { Box, Flex, Stack, useColorModeValue } from '@chakra-ui/react';

interface Props {
  children: React.ReactElement;
  fixedFooter: boolean;
}

const MainLayout = ({ children, fixedFooter = false }: Props) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.800')}>
      <Box minH={`calc(100vh - ${FOOTER_HEIGHT})`}>
        <Nav />
        <Stack pb={6} pt="65px">
          <Flex justifyContent="center" zIndex={2}>
            <Box
              maxW={BASE_WIDTH}
              w="100%"
              paddingInline={4}
            >
              {children}
            </Box>
          </Flex>
        </Stack>
      </Box>
      <Footer fixedFooter={false} />
      <ScrollToTop />
    </Box>
  );
};

export default MainLayout;
