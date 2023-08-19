import { UserProps } from 'store/actions/userSlice';
import history from 'utils/history';

import { Avatar, Flex, Text } from '@chakra-ui/react';

const UserTag = ({
  data,
  justifyContent = 'flex-start',
  isFullWidth = false,
}: {
  justifyContent?: string;
  data: UserProps;
  isFullWidth?: boolean;
}) => (
  <Flex gap={3} alignItems="center" justifyContent={justifyContent} w="100%">
    <Flex
      gap={3}
      alignItems="center"
      w={isFullWidth ? '100%' : 'auto'}
      // flexWrap="wrap"
      onClick={() => history.navigate(`/profile/${data?.uid}`)}
      _hover={{
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <Avatar
        name={data?.username || data?.displayName}
        src={data?.photoURL}
        size="sm"
      />

      <Text
        fontWeight={700}
        fontSize={14}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {data?.username || data?.displayName}
      </Text>
    </Flex>
  </Flex>
);

export default UserTag;
