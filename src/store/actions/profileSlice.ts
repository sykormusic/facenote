import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'services/firebase';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { PostProps } from './postSlice';
import { UserProps } from './userSlice';

export const getUserProfileAPI = createAsyncThunk(
  'profile/getUserProfile',
  async ({ uid }: { uid: string }) => {
    const data: any = await (await getDoc(doc(db, 'users', uid))).data();
    return data;
  }
);

export const getUserPostsAPI = createAsyncThunk(
  'profile/getUserPosts',
  async ({ uid }: { uid: string }) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const q = query(
        collection(db, 'posts'),
        where('user', '==', userDocRef),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const data: any = [];

      querySnapshot.forEach((d) => {
        const post = { ...d.data() };
        data.push(post);
      });

      // data = await Promise.all(
      //   data.map((d: PostProps) => {
      //     const x = { ...d };
      //     return getDoc(x.user).then((snap) => {
      //       const user = snap.data();
      //       return { ...x, user };
      //     });
      //   })
      // );

      return data;
    } catch (e) {
      console.log('🚀  ~ error get user posts', e);
    }
    return [];
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: <UserProps | null>null,
    posts: <PostProps[] | null>[],
  },
  reducers: {
    clearProfileState: (state) => {
      state.data = null;
    },
    // logout: (state: { user: UserProps | null }) => {
    //   state.user = null;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProfileAPI.fulfilled, (state, action) => {
      state.data = action.payload as UserProps;
    });
    builder.addCase(getUserPostsAPI.fulfilled, (state, action) => {
      state.posts = action.payload as PostProps[];
    });
  },
});

export const { clearProfileState } = profileSlice.actions;

// selectors
export const selectUserProfile = (state: any) => state.profile.data;
export const selectUserPosts = (state: any) => state.profile.posts;

export default profileSlice.reducer;
