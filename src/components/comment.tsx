/* eslint-disable react-hooks/rules-of-hooks */
import { selectUsers } from 'store/actions/globalSlice';
import { UserProps } from 'store/actions/userSlice';
import { useAppSelector } from 'store/hooks';
import { calculateTimeDifference } from 'utils/date_time';
import history from 'utils/history';

import {
  Avatar,
  Divider,
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';

const Comment = ({
  comment,
  isMe = false,
  onRemoveComment,
  onReply,
}: {
  comment: any;
  isMe?: boolean;
  onRemoveComment: (id: string) => void;
  onReply: (user: UserProps) => void;
}) => {
  const { user, content = '', timestamp } = comment || {};
  const users = useAppSelector(selectUsers);

  const userData = users
    ? users.find((x: UserProps) => user.path.includes(x?.uid))
    : {};

  return (
    <Flex gap={3} alignItems="center">
      <Flex gap={3} alignItems="flex-start">
        <Avatar
          name={userData?.username || userData?.displayName}
          src={userData?.photoURL}
          size="2xs"
        />

        <Stack spacing={2}>
          <Text mt="-4px">
            <Text
              fontWeight={700}
              fontSize={14}
              display="inline"
              pr={2}
              lineHeight="20px"
              onClick={() => history.navigate(`/profile/${userData?.uid}`)}
              _hover={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {userData?.username || userData?.displayName}
            </Text>
            <Text fontSize={14} display="inline" lineHeight="20px" m={0}>
              {content}
            </Text>
          </Text>
          <Flex gap={8} alignItems="center">
            <Tooltip
              label={
                timestamp ? new Date(timestamp.toDate()).toUTCString() : ''
              }
              placement="right"
            >
              <Text
                lineHeight="20px"
                fontSize={12}
                color={useColorModeValue('gray.600', 'gray.500')}
              >
                {calculateTimeDifference(timestamp)}
              </Text>
            </Tooltip>

            <Text
              lineHeight="20px"
              fontWeight={700}
              fontSize={12}
              color={useColorModeValue('gray.600', 'gray.500')}
              cursor="pointer"
              onClick={() => onReply(userData)}
            >
              Reply
            </Text>

            {isMe ? (
              <Popover placement="right" variant="">
                {({ isOpen, onClose }) => (
                  <>
                    <PopoverTrigger>
                      <Image
                        src={useColorModeValue(
                          '/icons/ic_more_light.svg',
                          '/icons/ic_more_dark.svg'
                        )}
                        height="16px"
                        width="16px"
                        cursor="pointer"
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      maxW={{ base: 'max-content', lg: 'max-content' }}
                    >
                      <PopoverArrow />
                      <PopoverBody>
                        <Stack divider={<Divider />}>
                          <Text
                            fontSize={13}
                            cursor="pointer"
                            onClick={async () => {
                              onRemoveComment(comment.id);
                              onClose();
                            }}
                          >
                            Delete
                          </Text>
                        </Stack>
                      </PopoverBody>
                    </PopoverContent>
                  </>
                )}
              </Popover>
            ) : null}
          </Flex>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default Comment;
