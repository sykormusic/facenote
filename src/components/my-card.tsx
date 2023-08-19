import React from 'react';

import { Box, Text, useColorModeValue } from '@chakra-ui/react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => (
  <Box pb={4} pt={4}>
    <Text
      fontWeight="bold"
      color={useColorModeValue('brand.600', 'brand.300')}
      fontSize={15}
      letterSpacing={1.2}
      paddingBottom={4}
      textTransform="uppercase"
    >
      {title}
    </Text>
    <Box fontSize={13} lineHeight="24px">
      {children}
    </Box>
  </Box>
);

export default Card;
