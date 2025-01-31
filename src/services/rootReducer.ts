import { userSlice } from './slices/userSlice';
import { feedSlice } from './slices/feedSlice';
import { ordersSlice } from './slices/orderSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { combineSlices } from '@reduxjs/toolkit';
import { burgerConstructorSlice } from './slices/burger-constructor-slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  userSlice,
  burgerConstructorSlice,
  ordersSlice,
  feedSlice
);

export default rootReducer;
