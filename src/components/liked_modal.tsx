import { selectUsers } from 'store/actions/globalSlice';
import { PostProps } from 'store/actions/postSlice';
import { UserProps } from 'store/actions/userSlice';
import { useAppSelector } from 'store/hooks';

import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
} from '@chakra-ui/react';

import UserTag from './user_tag';

const LikedModal = ({
  post,
  isOpen = false,
  onClose,
}: {
  post: PostProps;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const users = useAppSelector(selectUsers);

  return (
    <Modal onClose={onClose} isOpen={isOpen} motionPreset="scale">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Liked Users</ModalHeader>
        <ModalBody>
          <Box maxH="400px" overflowY="auto">
            <Stack divider={<StackDivider />} spacing="4">
              {(post.reactedUsers || []).map((x: string) => {
                const find = users.find((t: UserProps) => t.uid === x);
                if (!find) return null;
                return (
                  <UserTag
                    data={find}
                    key={find.uid}
                    justifyContent="space-between"
                  />
                );
              })}
            </Stack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="brand" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LikedModal;
