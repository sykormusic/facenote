import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { UserProps } from './userSlice';

export const getUsersAPI = createAsyncThunk(
  'global/getUsers',
  async ({ data }: { data: UserProps[] }) => data
);

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    users: <UserProps[] | null>[],
  },
  reducers: {
    // login: (state: { user: any }, action: { payload: any }) => {
    //   state.user = action.payload;
    // },
    // logout: (state: { user: UserProps | null }) => {
    //   state.user = null;
    // },
  },
  extraReducers: (builder) => {
    // builder.addCase(loginAPI.fulfilled, (state, action) => {
    //   state.user = action.payload as UserProps;
    // });
    builder.addCase(getUsersAPI.fulfilled, (state, action) => {
      state.users = action.payload as UserProps[];
    });
  },
});

// selectors
export const selectUsers = (state: any) => state.global.users;

export default globalSlice.reducer;
