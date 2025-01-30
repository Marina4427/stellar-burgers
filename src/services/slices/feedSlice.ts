import { getFeedsApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { RootState } from '../store';

type TFeedState = TOrdersData & {
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null
};

export const getFeed = createAsyncThunk('feeds/fetchFeed', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.isLoading = false;
        }
      )
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при обнолении ленты заказов';
      });
  }
});

export const feedSelectors = {
  ordersSelector: (state: RootState) => state.feed.orders,
  totalSelector: (state: RootState) => state.feed.total,
  totalTodaySelector: (state: RootState) => state.feed.totalToday,
  isLoadingSelector: (state: RootState) => state.feed.isLoading,
  errorSelector: (state: RootState) => state.feed.error
};

export default feedSlice.reducer;
