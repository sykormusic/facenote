/* eslint-disable react-hooks/rules-of-hooks */
import AddPostForm from 'components/add_post_form';
import LoadingSpinner from 'components/loading_spinner';
import Post from 'components/post';
import { doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import MainLayout from 'layouts/MainLayout';
import { useEffect, useRef, useState } from 'react';
import LazyLoad from 'react-lazyload';
import LoadingBar from 'react-top-loading-bar';
import { db, storage } from 'services/firebase';
import {
  getPostCommentsService,
  getPostListService,
  unsubscribeGetPosts,
} from 'services/postService';
import { selectUsers } from 'store/actions/globalSlice';
import {
  addCommentAPI,
  addPostAPI,
  deletePostAPI,
  getLoading,
  getPostCommentsAPI,
  getPosts,
  getPostsAPI,
  PostProps,
  reactPostAPI,
  removeCommentAPI,
} from 'store/actions/postSlice';
import { selectUser } from 'store/actions/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { scrollToTop } from 'utils/common';
import { useOnScreen } from 'utils/hooks';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  Stack,
  Text,
} from '@chakra-ui/react';

import PeopleMayKnow from './people_may_know';

const Home = ({ onShowLoading }: { onShowLoading: (val: boolean) => void }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const reachedBottom = useOnScreen(bottomRef);

  const dispatch = useAppDispatch();
  const posts = useAppSelector(getPosts);
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(getLoading);

  const { uid = '' } = user || {};

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [loadingFetchComments, setLoadingFetchComments] =
    useState<boolean>(false);
  const [loadingGetPosts, setLoadingGetPosts] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<string>('');
  const [percent, setPercent] = useState<number>(0);

  const onGetPosts = async (l: number) => {
    console.log('🚀  ~ limit', l);
    if (uid) {
      // onShowLoading(true);
      setLoadingGetPosts(true);
      getPostListService(l, async (payload: any) => {
        await dispatch(getPostsAPI(payload));

        setTimeout(() => {
          setLoadingGetPosts(false);
        }, 500);
        // onShowLoading(false);
      });
    }
  };

  const handleUpload = (file: any, totalFiles = 1, index = 0) =>
    new Promise((resolve) => {
      const processed = index / totalFiles;
      if (!file) resolve(null);
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot: { bytesTransferred: number; totalBytes: number }) => {
          const p = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // update progress
          setPercent((processed + p / 100 / (1 - processed)) * 100);
        },
        (err: any) => console.log(err),
        () => {
          resolve(getDownloadURL(uploadTask.snapshot.ref));
        }
      );
    });

  const onAddPost = async (values: { content: string }, files: any) => {
    const payload: any = {
      ...values,
      user: doc(db, `users/${user?.uid}`),
      files: [],
    };
    if (files) {
      setLoadingUpload(true);
      const uploadedFiles = await Promise.all(
        Array.from(files).map((x: any, index: number) =>
          handleUpload(x, files.length, index)
        )
      );
      setLoadingUpload(false);
      payload.files = uploadedFiles;
    }
    await dispatch(addPostAPI(payload));
    // onGetPosts();
  };

  const onRemovePost = async (id: string) => {
    await dispatch(deletePostAPI(id));
    // onGetPosts();
  };

  // reaction
  const onReactPost = async (post: PostProps, reactVal: string) => {
    await dispatch(
      reactPostAPI({ postId: post?.id, userId: user?.uid, reactVal })
    );
  };

  const onGetPostComment = (id: string) => {
    setLoadingFetchComments(true);
    getPostCommentsService(id, (payload: any) => {
      dispatch(getPostCommentsAPI(payload));
      setLoadingFetchComments(false);
    });
  };

  const onAddComment = async (post: PostProps, content: string) => {
    const res = await dispatch(
      addCommentAPI({
        post: post?.id,
        content,
        user: user?.uid,
      })
    );
    if (res) {
      onGetPostComment(post?.id);
    }
  };

  const onRemoveComment = async (postId: string, commentId: string) => {
    const res = await dispatch(
      removeCommentAPI({
        post: postId,
        comment: commentId,
      })
    );
    if (res) {
      onGetPostComment(postId);
    }
  };

  useEffect(() => {
    scrollToTop();
    return () => {
      unsubscribeGetPosts();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      onGetPosts(5);
    }, 200);
  }, [uid]);

  useEffect(() => {
    if (reachedBottom && !loadingGetPosts && posts.length > 0) {
      const l = posts.length + 5;
      if (l % 5 === 0) {
        setTimeout(() => {
          onGetPosts(l);
        }, 200);
      }
    }
  }, [reachedBottom]);

  return (
    <>
      <MainLayout fixedFooter>
        <Grid templateColumns="repeat(24,1fr)" gap={4}>
          <GridItem
            w="100%"
            colSpan={{
              xl: 16,
              lg: 16,
              sm: 24,
              md: 16,
              base: 24,
            }}
          >
            <Stack spacing={4}>
              {user ? (
                <AddPostForm
                  onAddPost={onAddPost}
                  loading={loading.addPost || loadingUpload}
                  name={(user?.displayName || '').split(' ').shift()}
                />
              ) : null}

              <Flex justifyContent="space-between" alignItems="center" gap={4}>
                <Menu>
                  <MenuButton
                    variant="ghost"
                    as={Button}
                    rightIcon={<ChevronDownIcon fontSize={18} />}
                  >
                    <Text lineHeight={0} p={0}>
                      News Feed
                    </Text>
                  </MenuButton>
                </Menu>
                {loadingGetPosts ? (
                  <Center p={2}>
                    <LoadingSpinner size="sm" />
                  </Center>
                ) : null}
              </Flex>
              {posts.map((item: PostProps) => (
                <LazyLoad height={200} key={item.id}>
                  <Post
                    onRemovePost={onRemovePost}
                    data={item}
                    onReactPost={onReactPost}
                    isReacted={(item?.reactedUsers || []).includes(user?.uid)}
                    onGetPostComment={onGetPostComment}
                    onAddComment={onAddComment}
                    setCurrentPost={setCurrentPost}
                    currentPost={currentPost}
                    onRemoveComment={onRemoveComment}
                    loadingFetchComments={loadingFetchComments}
                  />
                </LazyLoad>
              ))}

              {loadingGetPosts && posts.length > 0 ? (
                <Center p={1} h="40px">
                  <LoadingSpinner />{' '}
                </Center>
              ) : null}

              <div ref={bottomRef} />
            </Stack>
          </GridItem>
          <GridItem
            w="100%"
            colSpan={{
              xl: 8,
              lg: 8,
              sm: 24,
              md: 8,
              base: 24,
            }}
          >
            <Box position="sticky" top="65px">
              <Stack spacing={4}>
                {user ? <PeopleMayKnow /> : null}
                <Flex justifyContent="flex-end">
                  <Text fontSize={12}>
                    Facenote © 2023. All rights reserved.
                  </Text>
                </Flex>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </MainLayout>

      <LoadingBar
        color="red"
        progress={percent}
        onLoaderFinished={() => setPercent(0)}
      />
    </>
  );
};

export default Home;
