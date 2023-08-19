/* eslint-disable react-hooks/rules-of-hooks */
import BlankCard from 'components/blank_card';
import LoadingSpinner from 'components/loading_spinner';
import NoData from 'components/no_data';
import UsernameModal from 'components/username_modal';
import MainLayout from 'layouts/MainLayout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostProps } from 'store/actions/postSlice';
import {
  clearProfileState,
  getUserPostsAPI,
  getUserProfileAPI,
  selectUserPosts,
  selectUserProfile,
} from 'store/actions/profileSlice';
import { selectUser } from 'store/actions/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { scrollToTop } from 'utils/common';
import history from 'utils/history';

import { EditIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Badge,
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

const Profile = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectUserPosts);
  const profile = useAppSelector(selectUserProfile);
  const user = useAppSelector(selectUser);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const {
    isOpen: isOpenUsernameModal,
    onOpen: onOpenUsernameModal,
    onClose: onCloseUsernameModal,
  } = useDisclosure();

  const { uid = '' } = useParams();

  const isMe = user?.uid === uid;

  const formattedPosts = posts.filter(
    (x: PostProps) => x.files && (x.files || []).length > 0
  );

  const onGetUserProfile = async () =>
    dispatch(
      getUserProfileAPI({
        uid,
      })
    );

  const onGetUserPosts = async () =>
    dispatch(
      getUserPostsAPI({
        uid,
      })
    );

  const fetchData = async () => {
    setLoadingFetch(true);
    await Promise.all([onGetUserProfile(), onGetUserPosts()]);
    setLoadingFetch(false);
  };

  useEffect(() => {
    if (uid) {
      scrollToTop();
      fetchData();
    }
  }, [uid]);

  useEffect(
    () => () => {
      dispatch(clearProfileState());
    },
    []
  );

  const _renderContent = () => (
    <>
      <Stack spacing={6}>
        <Grid templateColumns="repeat(12,1fr)" gap={4}>
          <GridItem
            w="100%"
            colSpan={{
              xl: 4,
              lg: 4,
              md: 4,
              sm: 12,
              base: 12,
            }}
          >
            <BlankCard>
              <Box paddingBlock={4}>
                <Center>
                  <Flex
                    justifyContent="center"
                    direction="column"
                    alignItems="center"
                    gap={6}
                  >
                    <Avatar src={profile?.photoURL} size="xl" />
                    <Stack>
                      {profile?.username ? (
                        <Center mb={4}>
                          <Badge
                            variant="subtle"
                            colorScheme="green"
                            fontSize={14}
                            textTransform="unset"
                            borderRadius={30}
                            paddingInline={4}
                            position="relative"
                            flex={0}
                          >
                            {profile?.username}
                            {isMe ? (
                              <IconButton
                                aria-label=""
                                size="sm"
                                variant="ghost"
                                icon={<EditIcon />}
                                onClick={onOpenUsernameModal}
                                position="absolute"
                                right={-9}
                                mt="-1px"
                              />
                            ) : null}
                          </Badge>
                        </Center>
                      ) : null}
                      <Center>
                        <Text fontWeight={700} fontSize={16} lineHeight={1}>
                          {profile?.displayName}
                        </Text>
                      </Center>
                      {user ? (
                        <Center>
                          <Text fontSize={13}>{profile?.email}</Text>
                        </Center>
                      ) : null}
                    </Stack>
                  </Flex>
                </Center>
              </Box>
            </BlankCard>
          </GridItem>
          <GridItem
            w="100%"
            colSpan={{
              xl: 8,
              lg: 8,
              md: 8,
              sm: 12,
              base: 12,
            }}
          >
            <Stack spacing={4}>
              {/* <AddPostForm onAddPost={() => null} /> */}

              <BlankCard>
                {formattedPosts.length === 0 ? (
                  <Center>
                    <NoData description="No posts" />
                  </Center>
                ) : (
                  <SimpleGrid columns={3} gap={3}>
                    {formattedPosts.map((x: PostProps) => (
                      <Box
                        key={x.id}
                        pt="100%"
                        position="relative"
                        transition="0.3s"
                        _hover={{
                          opacity: 0.8,
                          transition: '0.3s',
                        }}
                        onClick={() => history.navigate(`/post/${x.id}`)}
                        cursor="pointer"
                      >
                        <Box
                          position="absolute"
                          width="100%"
                          height="100%"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                        >
                          <Image
                            src={x.files?.[0]}
                            h="100%"
                            w="100%"
                            objectFit="cover"
                            borderRadius={3}
                          />
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </BlankCard>
            </Stack>
          </GridItem>
        </Grid>
      </Stack>
      <UsernameModal
        isOpen={isOpenUsernameModal}
        onClose={() => {
          onCloseUsernameModal();
          onGetUserProfile();
        }}
        userId={user?.uid}
        canClose
        initialValue={user?.username}
      />
    </>
  );
  // if (!profile) return null;
  return (
    <MainLayout fixedFooter>
      {loadingFetch || !profile ? (
        <Center p={2}>
          <LoadingSpinner />
        </Center>
      ) : (
        _renderContent()
      )}
    </MainLayout>
  );
};

export default Profile;
