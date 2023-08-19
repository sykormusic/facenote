/* eslint-disable no-nested-ternary */
import { useEffect, useRef, useState } from 'react';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import { selectUsers } from 'store/actions/globalSlice';
import {
  getLoading,
  PostProps,
  selectPostComments,
} from 'store/actions/postSlice';
import { selectUser, UserProps } from 'store/actions/userSlice';
import { useAppSelector } from 'store/hooks';
import { hashtagify, singularify, urlify } from 'utils/common';
import { calculateTimeDifference, formatDate } from 'utils/date_time';
import useCheckMobileScreen from 'utils/useCheckMobileScreen';

import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapse,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

import Carousel from './carousel';
import Comment from './comment';
import EmojiPicker from './emoji_picker';
import LikedModal from './liked_modal';
import LoadingSpinner from './loading_spinner';
import UserTag from './user_tag';

const Post = ({
  data,
  onRemovePost,
  onReactPost,
  onGetPostComment,
  onAddComment,
  onRemoveComment,
  isReacted,
  hasBg = true,
  hasPadding = true,
  currentPost = '',
  setCurrentPost,
  mode = 1,
  isOpenComment = false,
  loadingFetchComments = false,
}: {
  data?: PostProps | null;
  onRemovePost: (id: string) => void;
  onReactPost?: (post: PostProps, reactVal: string) => void;
  onGetPostComment: (id: string) => void;
  onAddComment: (post: PostProps, content: string) => void;
  onRemoveComment: (postId: string, commentId: string) => void;
  isReacted?: boolean;
  loadingFetchComments?: boolean;
  hasBg?: boolean;
  isOpenComment?: boolean;
  hasPadding?: boolean;
  mode?: number;
  currentPost: string;
  setCurrentPost: (id: string) => void;
}) => {
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useAppSelector(selectUser);
  const allUsers = useAppSelector(selectUsers);
  const commentObj = useAppSelector(selectPostComments);
  const comments = data?.id ? commentObj?.[data?.id] || [] : [];

  const loading = useAppSelector(getLoading);
  const loadingAddComment = loading.addComment;
  const isOwner = data ? data.user.path.includes(user?.uid) : false;
  const isMobile = useCheckMobileScreen();

  const { isOpen: isViewComment, onToggle } = useDisclosure({
    defaultIsOpen: isOpenComment,
  });
  const {
    isOpen: isOpenLikedModal,
    onOpen: onOpenLikedModal,
    onClose: onCloseLikedModal,
  } = useDisclosure();

  const [isViewImageVisible, setIsViewImageVisible] = useState<boolean>(false);

  const [commentContent, setCommentContent] = useState<string>('');

  const moreIcon = useColorModeValue(
    '/icons/ic_more_light.svg',
    '/icons/ic_more_dark.svg'
  );

  const loveIcon = useColorModeValue(
    '/icons/ic_love_dark.svg',
    '/icons/ic_love_light.svg'
  );

  const commentIcon = useColorModeValue(
    '/icons/ic_comment_dark.svg',
    '/icons/ic_comment_light.svg'
  );

  const saveIcon = useColorModeValue(
    '/icons/ic_save_dark.svg',
    '/icons/ic_save_light.svg'
  );

  const loveCountColor = useColorModeValue('gray.700', 'gray.300');
  const hasBgColor = useColorModeValue('white', '#171923');
  const actionBorderTopColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onReactClick = () => {
    if (!!onReactPost && data?.id) {
      setTimeout(() => {
        onReactPost(data, isReacted ? '' : 'love');
      }, 100);
    }
  };

  const onCommentClick = async () => {
    if (loadingFetchComments || !data?.id) return null;
    setCurrentPost(data?.id);

    if (!isViewComment) {
      await onGetPostComment(data?.id);

      setTimeout(() => {
        setCurrentPost('');
        if (!isViewComment) {
          onToggle();
        }
      }, 200);
    } else {
      setCurrentPost('');
      onToggle();
    }
    return null;
  };

  useEffect(() => {
    // if navigate from another route, need to show comments on first load
    if (data && isOpenComment) {
      onGetPostComment(data?.id);
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  }, [isOpenComment]);

  useEffect(() => {
    if (isViewComment && !isMobile) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }
  }, [isViewComment]);

  const _renderButton = (icon: any, onClick?: () => void) => (
    <IconButton
      aria-label=""
      icon={icon}
      variant="ghost"
      onClick={onClick}
      isDisabled={!user}
      _active={{
        transform: 'scale(0.8)',
        transition: '0.1s',
      }}
    />
  );

  const onSendComment = async () => {
    if (data) {
      setCurrentPost(data?.id || '');
      await onAddComment(data, commentContent);
      setCommentContent('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setTimeout(() => {
        setCurrentPost('');
      }, 500);
    }
  };

  const onReplyComment = (u: UserProps) => {
    // if (!commentContent.includes(`@${u.displayName}`)) {
    //   setCommentContent((prev) => `@${u.displayName} ${prev}`);
    //   if (inputRef.current) {
    //     inputRef.current.focus();
    //   }
    // }
  };

  const _renderInput = () => {
    const loadingSend = loadingAddComment && data?.id === currentPost;

    return (
      <InputGroup size="lg">
        <Input
          pr="7.5rem"
          type="text"
          placeholder="Enter a comment"
          fontSize={13}
          variant="outline"
          autoFocus
          ref={inputRef}
          value={commentContent}
          isDisabled={loadingSend}
          onChange={(e) => setCommentContent(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              onSendComment();
            }
          }}
        />
        <InputRightElement width="7.5rem">
          <EmojiPicker
            onClick={(val) => {
              setCommentContent((prev) => prev + val);
            }}
            placement="bottom"
          >
            <IconButton
              icon={<Text fontSize={16}>😂</Text>}
              aria-label=""
              bg="transparent"
              size="sm"
            />
          </EmojiPicker>
          <Button
            h="2.2rem"
            size="md"
            ml={1}
            onClick={onSendComment}
            variant="solid"
            colorScheme="brand"
            isLoading={loadingSend}
            // rightIcon={<IoSend />}
          >
            Send
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  };

  const _renderCommentList = () => {
    if (!loadingFetchComments && comments.length === 0) {
      return null;
    }
    return (
      <Stack
        spacing={6}
        paddingInline={2}
        marginTop={comments.length > 0 ? 5 : 0}
      >
        {comments.map((x: any) => (
          <Comment
            comment={x}
            key={x.id}
            isMe={x.user.path.includes(user?.uid)}
            onRemoveComment={() => onRemoveComment(data?.id || '', x.id)}
            onReply={onReplyComment}
          />
        ))}
      </Stack>
    );
  };

  const _renderComments = () => (
    <Collapse in={isViewComment} animateOpacity>
      <Box paddingInline={0} pt={2} pb={4}>
        <Box>{_renderInput()}</Box>
        {_renderCommentList()}
      </Box>
    </Collapse>
  );

  const _renderLikedText = () => {
    if (!data) return null;
    if ((data.reactedUsers || []).length === 0) return null;
    const likes = data.reactedUsers.length;
    if (isReacted && likes > 1) {
      return (
        <Text fontSize={14} ml={2} color={loveCountColor} lineHeight={0}>
          <Text display="inline">Liked by</Text>{' '}
          <Text display="inline" fontWeight={700}>
            you
          </Text>{' '}
          and{' '}
          <Text
            display="inline"
            fontWeight={700}
            _hover={{
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={onOpenLikedModal}
          >
            {likes - 1} {singularify('other', likes - 1)}
          </Text>
        </Text>
      );
    }
    return (
      <Text
        fontSize={14}
        ml={2}
        color={loveCountColor}
        fontWeight={700}
        lineHeight={0}
        _hover={{
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
        onClick={onOpenLikedModal}
      >
        {likes} {singularify('like', likes)}
      </Text>
    );
  };

  const _renderViewCommentBtn = () => {
    if (loadingFetchComments && currentPost === data?.id) {
      return <LoadingSpinner size="sm" />;
    }
    if (isViewComment) return <ChevronUpIcon fontSize={20} fontWeight={700} />;
    return <ChevronDownIcon fontSize={20} fontWeight={700} />;
  };

  const getPaddingBottom = () => {
    if (hasPadding) {
      if ((data?.comments || [].length) === 0) return 2;
      return 4;
    }

    return 0;
  };
  if (!data) return null;

  return (
    <Box
      paddingInline={hasPadding ? 4 : 0}
      pt={hasPadding ? 4 : 0}
      pb={getPaddingBottom()}
      bg={hasBg ? hasBgColor : 'transparent'}
      borderRadius={8}
    >
      <Grid templateColumns="repeat(12,1fr)" gap={0}>
        <GridItem
          w="100%"
          colSpan={{
            xl: 12,
            lg: 12,
            sm: 12,
            md: 12,
            base: 12,
          }}
        >
          <Card
            w="100%"
            borderRadius={8}
            boxShadow="none"
            p={0}
            bg="transparent"
          >
            <CardHeader paddingBlock={0} paddingInline={0}>
              <Flex
                gap={4}
                justifyContent="space-between"
                alignItems="center"
                w="100%"
              >
                <Flex gap={4} alignItems="center">
                  <UserTag
                    data={allUsers.find((t: UserProps) =>
                      (data.user.path || '').includes(t.uid)
                    )}
                  />
                  {data.timestamp ? (
                    <Tooltip
                      label={
                        data.timestamp
                          ? new Date(data.timestamp.toDate()).toUTCString()
                          : ''
                      }
                      placement="right"
                    >
                      <Text fontSize={13} color="gray.500" whiteSpace="nowrap">
                        {calculateTimeDifference(data.timestamp)}
                      </Text>
                    </Tooltip>
                  ) : (
                    <Text fontSize={13} color="gray.500" whiteSpace="nowrap">
                      {data.createdAt
                        ? formatDate(new Date(data.createdAt))
                        : ''}
                    </Text>
                  )}
                </Flex>

                {isOwner ? (
                  <Menu placement="bottom-end">
                    <MenuButton
                      as={Button}
                      borderWidth={0}
                      bg="transparent"
                      p={0}
                    >
                      <IconButton
                        variant="ghost"
                        colorScheme="gray"
                        aria-label="See menu"
                        icon={
                          <Image
                            src={moreIcon}
                            height="16px"
                            width="16px"
                            cursor="pointer"
                          />
                        }
                      />
                    </MenuButton>

                    <MenuList alignItems="center" minW="0" w="100px">
                      <MenuItem
                        fontWeight={500}
                        onClick={() => onRemovePost(data.id)}
                        icon={<DeleteIcon fontSize={12} />}
                        fontSize={13}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                ) : null}
              </Flex>
            </CardHeader>
            <CardBody paddingBlock={4} paddingInline={0}>
              <Text
                whiteSpace="pre-line"
                lineHeight={1.7}
                fontSize={14}
                dangerouslySetInnerHTML={{
                  __html: hashtagify(urlify(data.content)),
                }}
              />
              {(data.files || []).length > 0 ? (
                <Box
                  pt={4}
                  position="relative"
                  // onClick={() => setIsViewImageVisible(true)}
                  // cursor="pointer"
                  display="flex"
                  justifyContent="center"
                >
                  <Carousel
                    images={data.files}
                    onViewImages={() => setIsViewImageVisible(true)}
                  />
                </Box>
              ) : null}
            </CardBody>

            <CardFooter
              justify="space-between"
              flexWrap="wrap"
              pt={2}
              pb={2}
              paddingInline={0}
              borderTop="1px solid"
              borderColor={actionBorderTopColor}
            >
              <Flex gap={2} alignItems="center">
                {_renderButton(
                  <Image
                    src={isReacted ? '/icons/ic_loved.svg' : loveIcon}
                    w={6}
                    h={6}
                  />,
                  onReactClick
                )}
                {_renderButton(
                  <Image src={commentIcon} w={6} h={6} />,
                  onCommentClick
                )}

                {_renderLikedText()}
              </Flex>
              <Flex alignItems="center" gap={4}>
                {_renderButton(<Image src={saveIcon} w={6} h={6} />)}
              </Flex>
            </CardFooter>

            {(data?.comments || []).length > 0 ? (
              <Button
                variant="ghost"
                pb={2}
                pl={1}
                pt={2}
                gap={2}
                marginBlock={0}
                alignItems="center"
                cursor={user ? 'pointer' : 'not-allowed'}
                width="fit-content"
                onClick={user ? onCommentClick : () => null}
              >
                <Flex
                  w="24px"
                  h="24px"
                  justifyContent="center"
                  alignItems="center"
                >
                  {_renderViewCommentBtn()}
                </Flex>

                <Text fontSize={14} fontWeight={500} lineHeight={0}>
                  {isViewComment
                    ? 'Hide comments'
                    : `View ${
                        (data?.comments || []).length || 'all'
                      } ${singularify(
                        'comment',
                        (data?.comments || []).length
                      )}`}
                </Text>
              </Button>
            ) : null}
          </Card>
        </GridItem>

        <GridItem
          w="100%"
          colSpan={{
            xl: 12,
            lg: 12,
            sm: 12,
            md: 12,
            base: 12,
          }}
        >
          <Box pl={0} position="relative" h="100%">
            {_renderComments()}
          </Box>
        </GridItem>
      </Grid>
      <div ref={bottomRef} />
      <LikedModal
        post={data}
        isOpen={isOpenLikedModal}
        onClose={onCloseLikedModal}
      />
      {isViewImageVisible ? (
        <ReactSimpleImageViewer
          src={data.files || []}
          onClose={() => {
            setIsViewImageVisible(false);
          }}
          disableScroll
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 2000,
            marginTop: '50px',
            paddingTop: '50px',
            paddingBottom: '100px',
          }}
          closeOnClickOutside
        />
      ) : null}
    </Box>
  );
};

export default Post;
