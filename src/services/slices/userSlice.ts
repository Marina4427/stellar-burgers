import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { RootState } from '../store';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: true,
  error: null
};

export const getUser = createAsyncThunk('user/fetchUser', getUserApi);

export const registerUser = createAsyncThunk(
  'user/fetchRegisterUser',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    return data;
  }
);

export const loginUser = createAsyncThunk(
  'user/fetchLoginUser',
  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);
    return data;
  }
);

export const updateUser = createAsyncThunk(
  'user/fetchUpdateUser',
  async (user: TRegisterData) => {
    const data = await updateUserApi(user);
    return data;
  }
);

export const logoutUser = createAsyncThunk('user/fetchLogout', logoutApi);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при получении данных';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = null;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = null;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при входе';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при выходе из ЛК';
      });
  }
});

export const userSelectors = {
  userSelector: (state: RootState) => state.user.user,
  isLoadingSelector: (state: RootState) => state.user.isLoading,
  errorSelector: (state: RootState) => state.user.error
};

export default userSlice.reducer;
