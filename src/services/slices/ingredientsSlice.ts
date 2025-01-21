import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const getIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при получении данных с сервера';
      });
  }
});

export const ingredientsSelectors = {
  ingredientsSelector: (state: RootState) => state.ingredients.ingredients,
  isLoadingSelector: (state: RootState) => state.ingredients.isLoading,
  errorSelector: (state: RootState) => state.ingredients.error
};

export default ingredientsSlice.reducer;
