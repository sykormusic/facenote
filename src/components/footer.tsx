import { FOOTER_HEIGHT } from 'myConstants';
import { AiFillHeart } from 'react-icons/ai';

import { Box, Center, Flex, Text, useColorModeValue } from '@chakra-ui/react';

const Footer = ({ fixedFooter }: { fixedFooter: boolean }) => (
  <Flex
    justifyContent="center"
    bg={useColorModeValue('white', 'gray.900')}
    zIndex={2}
    px={4}
    pt={4}
    pb={4}
    h={FOOTER_HEIGHT}
    style={
      fixedFooter
        ? {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
          }
        : {}
    }
  >
    <Center fontSize={13}>
      <Text display="inline">Made with</Text>
      <Box px={2}>
        <AiFillHeart color="#D282A9" />
      </Box>
      <Text display="inline" mr={2}>
        by
      </Text>

      <Text
        style={{
          fontWeight: 700,
          display: 'inline',
        }}
      >
        Sykor
      </Text>
    </Center>
  </Flex>
);

export default Footer;
