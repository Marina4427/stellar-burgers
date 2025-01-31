import feedReducer, { getFeed, initialState } from './feedSlice';

const feedMock = {
  orders: [
    {
      _id: 'order1',
      status: 'done',
      name: 'Burger Deluxe',
      createdAt: '2023-01-01T10:00:00.000Z',
      updatedAt: '2023-01-01T11:00:00.000Z',
      number: 101,
      ingredients: ['ingredient1', 'ingredient2', 'ingredient3']
    },
    {
      _id: 'order2',
      status: 'pending',
      name: 'Veggie Delight',
      createdAt: '2023-01-02T12:00:00.000Z',
      updatedAt: '2023-01-02T13:00:00.000Z',
      number: 102,
      ingredients: ['ingredient4', 'ingredient5']
    }
  ],
  total: 200,
  totalToday: 15
};

describe('feedSlice', () => {
  test('вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером', () => {
    const state = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('обработка загрузки getFeed.pending', () => {
    const action = { type: getFeed.pending.type };
    const state = feedReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: null,
      isLoading: true
    });
  });

  test('обработка успешного выполнения getFeed.fulfilled', () => {
    const action = {
      type: getFeed.fulfilled.type,
      payload: feedMock
    };
    const state = feedReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orders: feedMock.orders,
      total: feedMock.total,
      totalToday: feedMock.totalToday,
      error: null,
      isLoading: false
    });
  });

  test('обработка ошибки getFeed.rejected', () => {
    const action = {
      type: getFeed.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = feedReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });
});
