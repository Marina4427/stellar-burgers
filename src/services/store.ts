import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './slices/userSlice';
import { feedSlice } from './slices/feedSlice';
import { ordersSlice } from './slices/orderSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { burgerConstructorSlice } from './slices/burger-constructor-slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  userSlice,
  burgerConstructorSlice,
  ordersSlice,
  feedSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export default store;
