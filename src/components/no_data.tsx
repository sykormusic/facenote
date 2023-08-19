import { Flex, Image, Text } from '@chakra-ui/react';

const NoData = ({
  description = 'No data available',
}: {
  description?: string;
}) => (
  <Flex gap={4} alignItems="center" direction="column" p={4}>
    <Image src="/images/empty.png" w="100px" h="100px" />
    <Text fontWeight={700} fontSize={14}>
      {description}
    </Text>
  </Flex>
);

export default NoData;
