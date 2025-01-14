import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { burgerConstructorActions } from '../../services/slices/burger-constructor-slice';

type TOrdersState = {
  orders: TOrder[];
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null
};

export const getOrderBurger = createAsyncThunk<TOrder, string[]>(
  'orders/fetchOrderBurger',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

export const getOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/fetchOrderByNumber',
  async (number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const getOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchOrders',
  getOrdersApi
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    //Действие для установки данных заказа в модальное окно.
    orderModalDataAction: (state, action: PayloadAction<TOrder | null>) => {
      state.order = action.payload;
    },
    clearOrderModalDataAction: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderBurger.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderBurger.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при получении заказа';
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при получении заказов';
      });
  }
});

export const orderActions = ordersSlice.actions;

export const orderSelectors = {
  ordersSelector: (state: RootState) => state.orders.orders,
  orderSelector: (state: RootState) => state.orders.order,
  isLoadingSelector: (state: RootState) => state.orders.isLoading,
  errorSelector: (state: RootState) => state.orders.error
};

export default ordersSlice.reducer;
