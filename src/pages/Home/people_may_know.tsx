import BlankCard from 'components/blank_card';
import UserTag from 'components/user_tag';
import { selectUsers } from 'store/actions/globalSlice';
import { selectUser, UserProps } from 'store/actions/userSlice';
import { useAppSelector } from 'store/hooks';

import { Box, Stack, StackDivider } from '@chakra-ui/react';
import NoData from 'components/no_data';

const PeopleMayKnow = () => {
  const users = useAppSelector(selectUsers);
  const me = useAppSelector(selectUser);

  const filteredUsers = users.filter((x: UserProps) => x.uid !== me?.uid);
  const data = filteredUsers;

  if (data.length === 0) {
    return <BlankCard title="People you may know"><NoData description='' /></BlankCard>
  }
  return (
    <BlankCard title="People you may know">
      <Box maxH="200px" overflowY="auto">
        <Stack divider={<StackDivider />} spacing="4">
          {data.map((x: UserProps) => (
            <UserTag
              data={x}
              key={x.uid}
              justifyContent="space-between"
            />
          ))}
        </Stack>
      </Box>
    </BlankCard>
  );
};

export default PeopleMayKnow;
