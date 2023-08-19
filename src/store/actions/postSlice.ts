import { UserProps } from 'store/actions/userSlice';
/* eslint-disable no-param-reassign */
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from 'services/firebase';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface PostProps {
  id: string;
  reactedUsers: string[];
  content: string;
  user: any;
  files: string[];
  createdAt?: string;
  timestamp?: any;
  comments?: string[];
}

export interface PostState {
  loading: {
    getPosts: boolean;
    addPost: boolean;
    getPostComments: boolean;
    addComment: boolean;
  };
  posts: PostProps[];
  viewingPost: PostProps | null;
  likedList: UserProps[];
  comments: Record<string, any>;
}

export const addPostAPI = createAsyncThunk(
  'post/addPost',
  async (payload: object) => {
    const randomId = Date.now().toString();
    await setDoc(doc(db, 'posts', randomId), {
      ...payload,
      id: randomId,
      timestamp: serverTimestamp(),
    });
  }
);

export const getPostsAPI = createAsyncThunk(
  'post/getPosts',
  async ({ data = [] }: { data: any[] }) => data
);

export const getPostDetailsAPI = createAsyncThunk(
  'post/getPostDetails',
  async ({ data }: { data: any }) => data
);

export const deletePostAPI = createAsyncThunk(
  'post/deletePost',
  async (id: string) => {
    await deleteDoc(doc(db, 'posts', id));
  }
);

export const reactPostAPI = createAsyncThunk(
  'post/reactPost',
  async ({
    postId,
    userId,
    reactVal,
  }: {
    postId: string;
    userId: string;
    reactVal: string;
  }) => {
    if (!userId) return null;
    await updateDoc(doc(db, 'posts', postId), {
      reactedUsers:
        reactVal === 'love' ? arrayUnion(userId) : arrayRemove(userId),
    });
    return 1;
  }
);

export const addCommentAPI = createAsyncThunk(
  'post/addComment',
  async ({
    post,
    user,
    content,
  }: {
    post: string;
    user: string;
    content: string;
  }) => {
    const randomId = Date.now().toString();
    await setDoc(doc(db, 'comments', randomId), {
      post: doc(db, `posts/${post}`),
      user: doc(db, `users/${user}`),
      content,
      id: randomId,
      timestamp: serverTimestamp(),
    });
    await updateDoc(doc(db, 'posts', post), {
      comments: arrayUnion(randomId),
    });
  }
);

export const removeCommentAPI = createAsyncThunk(
  'post/removeComment',
  async ({ post, comment }: { post: string; comment: string }) => {
    await deleteDoc(doc(db, 'comments', comment));
    await updateDoc(doc(db, 'posts', post), {
      comments: arrayRemove(comment),
    });
  }
);

export const getPostCommentsAPI = createAsyncThunk(
  'post/getPostComments',
  async ({ post, data = [] }: { post: string; data: any[] }) => ({
    post,
    data,
  })
);

// export const getLikedListAPI = createAsyncThunk(
//   'post/getLikedList',
//   async ({ postId }: { postId: string }) => {
//     console.log('🚀  ~ postId', postId);
//     const q = query(
//       collection(db, 'posts'),
//       where('id', '==', postId)
//       // orderBy('timestamp', 'desc')
//     );

//     const snapshot = await getDocs(q);
//     console.log('🚀  ~ snapshot', snapshot.docs);

//     const d: UserProps[] = await Promise.all(
//       (snapshot.docs || []).map(async (item: any) => item.data())
//     );
//     console.log('🚀  ~ d', d);
//     return d;
//   }
// );

export const postSlice = createSlice({
  name: 'post',
  initialState: <PostState>{
    posts: [],
    loading: {
      getPosts: false,
      addPost: false,
      getPostComments: false,
      addComment: false,
    },
    viewingPost: null,
    likedList: [],
    comments: {},
  },
  // pure functions
  reducers: {
    clearViewingPost: (state) => {
      state.viewingPost = null;
    },
    clearPosts: (state) => {
      state.posts = [];
    },
  },
  // async functions
  extraReducers: (builder) => {
    builder.addCase(addPostAPI.pending, (state) => {
      state.loading.addPost = true;
    });
    builder.addCase(addPostAPI.fulfilled, (state) => {
      state.loading.addPost = false;
    });
    builder.addCase(addPostAPI.rejected, (state) => {
      state.loading.addPost = false;
    });

    builder.addCase(getPostsAPI.pending, (state) => {
      state.loading.getPosts = true;
    });
    builder.addCase(getPostsAPI.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.loading.getPosts = false;
    });
    builder.addCase(getPostsAPI.rejected, (state) => {
      state.loading.getPosts = false;
    });

    builder.addCase(getPostDetailsAPI.fulfilled, (state, action) => {
      state.viewingPost = action.payload;
    });

    // get comments
    builder.addCase(getPostCommentsAPI.pending, (state, action) => {
      state.loading.getPostComments = true;
    });

    builder.addCase(getPostCommentsAPI.fulfilled, (state, action) => {
      const { post = '', data = [] } = action.payload || {};
      if (post) {
        state.comments[post] = data;
      }
      state.loading.getPostComments = false;
    });
    builder.addCase(getPostCommentsAPI.rejected, (state) => {
      state.loading.getPostComments = false;
    });

    // add comments
    builder.addCase(addCommentAPI.pending, (state) => {
      state.loading.addComment = true;
    });
    builder.addCase(addCommentAPI.fulfilled, (state) => {
      state.loading.addComment = false;
    });
    builder.addCase(addCommentAPI.rejected, (state) => {
      state.loading.addComment = false;
    });

    // get liked list
    // builder.addCase(getLikedListAPI.fulfilled, (state, action) => {
    //   state.likedList = action.payload;
    // });
  },
});

export const { clearViewingPost, clearPosts } = postSlice.actions;

// selectors
export const getPosts = (state: any) => state.post.posts;
export const getLoading = (state: any) => state.post.loading;
export const selectPostDetails = (state: any) => state.post.viewingPost;
export const selectPostComments = (state: any) => state.post.comments;
export const selectLikedList = (state: any) => state.post.likedList;

export default postSlice.reducer;
