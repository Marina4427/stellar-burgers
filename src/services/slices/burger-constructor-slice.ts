import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { RootState } from '../store';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients = [...state.ingredients, action.payload];
      }
    },
    replaceIngredient: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const ingredient = state.ingredients.splice(from, 1)[0];
      state.ingredients.splice(to, 0, ingredient);
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const burgerConstructorSelectors = {
  bunSelector: (state: RootState) => state.burgerConstructor.bun,
  ingredientsSelector: (state: RootState) => state.burgerConstructor.ingredients
};

export const burgerConstructorActions = burgerConstructorSlice.actions;
export default burgerConstructorSlice;
