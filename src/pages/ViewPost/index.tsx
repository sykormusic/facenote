/* eslint-disable react-hooks/rules-of-hooks */
import BlankCard from 'components/blank_card';
import LoadingSpinner from 'components/loading_spinner';
import Post from 'components/post';
import MainLayout from 'layouts/MainLayout';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  getPostCommentsService,
  getPostDetailService,
} from 'services/postService';
import { selectUsers } from 'store/actions/globalSlice';
import {
  addCommentAPI,
  clearViewingPost,
  deletePostAPI,
  getPostCommentsAPI,
  getPostDetailsAPI,
  PostProps,
  reactPostAPI,
  removeCommentAPI,
  selectPostDetails,
} from 'store/actions/postSlice';
import { selectUser } from 'store/actions/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import history from 'utils/history';

import { Center, Stack, Text } from '@chakra-ui/react';
import useToastHook from 'utils/notification';

const ViewPost = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [didMount, setDidMount] = useState<boolean>(false);
  const [toast, newToast] = useToastHook();
  const [loadingFetchComments, setLoadingFetchComments] =
    useState<boolean>(false);

  const post = useAppSelector(selectPostDetails);

  const { postId = '' } = useParams();
  const { state } = useLocation();

  const onFetchPost = async () => {
    if (postId) {
      setLoadingFetch(true);
      await getPostDetailService(postId, (payload) => {
        dispatch(getPostDetailsAPI(payload));
      });

      setLoadingFetch(false);
    }
  };

  const onReactPost = async (postProp: PostProps, reactVal: string) => {
    await dispatch(
      reactPostAPI({ postId: postProp?.id, userId: user?.uid, reactVal })
    );
    onFetchPost();
  };

  const onRemovePost = async (id: string) => {
    await dispatch(deletePostAPI(id));
    newToast({
      title: 'Post removed successfully.',
      // description: 'Post removed successfully.',
      status: 'success',
    });
    history.navigate(-1);
  };

  const onGetPostComment = (id: string) => {
    setLoadingFetchComments(true);
    getPostCommentsService(id, (payload: any) => {
      dispatch(getPostCommentsAPI(payload));
      setLoadingFetchComments(false);
    });
  };

  const onAddComment = async (postProp: PostProps, content: string) => {
    const res = await dispatch(
      addCommentAPI({
        post: postProp?.id,
        content,
        user: user?.uid,
      })
    );
    if (res) {
      onGetPostComment(postProp?.id);
    }
  };

  const onRemoveComment = async (postId1: string, commentId: string) => {
    const res = await dispatch(
      removeCommentAPI({
        post: postId1,
        comment: commentId,
      })
    );
    if (res) {
      newToast({
        title: 'Remove comment successfully!',
        status: 'success',
      });
      onGetPostComment(postId);
      // onFetchPost();
    }
  };

  useEffect(() => {
    if (postId) {
      setDidMount(false);
      onFetchPost();
      setTimeout(() => {
        setDidMount(true);
      }, 200);
    }
  }, [postId]);

  useEffect(
    () => () => {
      dispatch(clearViewingPost());
    },
    []
  );

  const _renderContent = () => {
    if (didMount && !loadingFetch && !post) {
      return (
        <Center p={4}>
          <Text fontSize={13} fontWeight={700}>
            This post has been removed
          </Text>
        </Center>
      );
    }
    return (
      <Stack spacing={6}>
        <BlankCard>
          <Post
            data={post}
            hasBg={false}
            hasPadding={false}
            isReacted={(post?.reactedUsers || []).includes(user?.uid)}
            onRemovePost={onRemovePost}
            onReactPost={onReactPost}
            mode={2}
            onGetPostComment={onGetPostComment}
            onAddComment={onAddComment}
            setCurrentPost={() => null}
            currentPost={postId}
            onRemoveComment={onRemoveComment}
            loadingFetchComments={loadingFetchComments}
          />
        </BlankCard>
      </Stack>
    );
  };

  return (
    <MainLayout fixedFooter>
      {loadingFetch || !didMount ? (
        <Center p={4}>
          <LoadingSpinner />
        </Center>
      ) : (
        _renderContent()
      )}
    </MainLayout>
  );
};

export default ViewPost;
