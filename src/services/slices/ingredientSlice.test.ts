import ingredientsReducer, {
  getIngredients,
  initialState
} from './ingredientsSlice';

describe('ingredientsSlice', () => {
  test('вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('обработка загрузки getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка успешного выполнения getIngredients.fulfilled', () => {
    const ingredientsMock = [
      {
        _id: 'ingredient1',
        name: 'Bun',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 250,
        price: 100,
        image: 'https://example.com/image1.png',
        image_mobile: 'https://example.com/image1-mobile.png',
        image_large: 'https://example.com/image1-large.png',
        __v: 0
      },
      {
        _id: 'ingredient2',
        name: 'Patty',
        type: 'main',
        proteins: 50,
        fat: 40,
        carbohydrates: 20,
        calories: 400,
        price: 200,
        image: 'https://example.com/image2.png',
        image_mobile: 'https://example.com/image2-mobile.png',
        image_large: 'https://example.com/image2-large.png',
        __v: 0
      }
    ];
    const action = {
      type: getIngredients.fulfilled.type,
      payload: ingredientsMock
    };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ingredients: ingredientsMock,
      isLoading: false,
      error: null
    });
  });

  test('обработка ошибки getIngredients.rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });
});
