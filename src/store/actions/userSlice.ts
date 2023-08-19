import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'services/firebase';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface UserProps {
  uid?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  username?: string;
}

export const loginAPI = createAsyncThunk(
  'user/login',
  async ({ data }: any) => data
);

// export const createUserAPI = createAsyncThunk(
//   'user/create',
//   async (payload: any) => {
//     await setDoc(doc(db, 'users', payload.uid), payload);
//   }
// );

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: <UserProps | null>null,
  },
  reducers: {
    // login: (state: { user: any }, action: { payload: any }) => {
    //   state.user = action.payload;
    // },
    logout: (state: { user: UserProps | null }) => {
      state.user = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAPI.fulfilled, (state, action) => {
      state.user = action.payload as UserProps;
    });
  },
});

export const { logout } = userSlice.actions;

// selectors
export const selectUser = (state: any) => state.user.user;

export default userSlice.reducer;
