/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';

import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';

const BlankCard = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => (
  <Box w="100%" borderRadius={8} overflow="hidden">
    {title ? (
      <Flex
        justifyContent="flex-start"
        pt={4}
        pl={4}
        pr={4}
        pb={2}
        gap={4}
        alignItems="center"
        backgroundColor={useColorModeValue('white', '#171923')}
      >
        <Text
          fontSize={14}
          fontWeight={700}
          color={useColorModeValue('#000', '#fff')}
        >
          {title}
        </Text>
        <Box />
      </Flex>
    ) : null}
    <Box
      bg={useColorModeValue('white', '#171923')}
      p={4}
      w="100%"
      borderRadius={0}
      lineHeight={1.8}
      // fontSize={13}
    >
      {children}
    </Box>
  </Box>
);

export default BlankCard;
