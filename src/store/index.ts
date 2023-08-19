import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import globalReducer from './actions/globalSlice';
import postReducer from './actions/postSlice';
import profileReducer from './actions/profileSlice';
import userReducer from './actions/userSlice';

export const store = configureStore({
  reducer: {
    global: globalReducer,
    user: userReducer,
    post: postReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
