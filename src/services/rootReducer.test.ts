import { initialState as userState } from './slices/userSlice';
import { initialState as feedState } from './slices/feedSlice';
import { initialState as ordersState } from './slices/orderSlice';
import { initialState as ingredientsState } from './slices/ingredientsSlice';
import { initialState as constructorState } from './slices/burger-constructor-slice';
import rootReducer from './rootReducer';

describe('rootReducer', () => {
  it('должен инициализировать rootReducer с начальным состоянием', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      burgerConstructor: constructorState,
      ingredients: ingredientsState,
      orders: ordersState,
      user: userState,
      feed: feedState
    });
  });
});
