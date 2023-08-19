import { APP_NAME } from 'myConstants';
import { IoLogoInstagram } from 'react-icons/io5';
import history from 'utils/history';

import { Flex, Text } from '@chakra-ui/react';

const Logo = ({ size = 22 }: { size?: number }) => (
  <Flex
    gap={3}
    alignItems="center"
    cursor="pointer"
    w="fit-content"
    onClick={() => {
      history.navigate('/');
    }}
  >
    <IoLogoInstagram fontSize={size} color="#D282A9" />
    <Flex>
      <Text
        fontSize={size - 2}
        letterSpacing={1}
        fontWeight={700}
        color="#D282A9"
      >
        {APP_NAME.substring(0, 4)}
      </Text>
      <Text
        fontSize={size - 2}
        letterSpacing={1}
        fontWeight={700}
        color="brand.400"
      >
        {APP_NAME.substring(4, APP_NAME.length)}
      </Text>
    </Flex>
  </Flex>
);

export default Logo;
