import burgerConstructorSlice, {
  burgerConstructorActions,
} from './burger-constructor-slice';
import { TConstructorIngredient } from '@utils-types';

describe('burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TConstructorIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 40,
    calories: 200,
    price: 100,
    image: 'bun-image.png',
    image_large: 'bun-image-large.png',
    image_mobile: 'bun-image-mobile.png',
    id: 'uuid1' // Уникальный идентификатор для конструктора
  };

  const mockIngredient: TConstructorIngredient = {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 30,
    calories: 150,
    price: 50,
    image: 'ingredient-image.png',
    image_large: 'ingredient-image-large.png',
    image_mobile: 'ingredient-image-mobile.png',
    id: 'uuid2' // Уникальный идентификатор для конструктора
  };

  test('вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером', () => {
    expect(
      burgerConstructorSlice.reducer(undefined, { type: 'unknown' })
    ).toEqual(initialState);
  });

  test('проверка добавления ингредиента для булочки', () => {
    const state = burgerConstructorSlice.reducer(
      initialState,
      burgerConstructorActions.addIngredient(mockBun)
    );
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toEqual([]);
  });

  test('проверка добавления ингредиента для небулочного ингредиента', () => {
    const state = burgerConstructorSlice.reducer(
      initialState,
      burgerConstructorActions.addIngredient(mockIngredient)
    );
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([mockIngredient]);
  });

  test('проверка перемещения ингредиента', () => {
    const initialStateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient, { ...mockIngredient, id: 'uuid3' }]
    };

    const state = burgerConstructorSlice.reducer(
      initialStateWithIngredients,
      burgerConstructorActions.replaceIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients[0].id).toBe('uuid3');
    expect(state.ingredients[1].id).toBe('uuid2');
  });

  it('проверка удаления ингредиента', () => {
    const initialStateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient]
    };

    const state = burgerConstructorSlice.reducer(
      initialStateWithIngredients,
      burgerConstructorActions.removeIngredient(0)
    );

    expect(state.ingredients).toEqual([]);
  });

  it('проверка очистки все ингредиентов', () => {
    const initialStateWithIngredients = {
      bun: mockBun,
      ingredients: [mockIngredient]
    };

    const state = burgerConstructorSlice.reducer(
      initialStateWithIngredients,
      burgerConstructorActions.clearIngredients()
    );

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
