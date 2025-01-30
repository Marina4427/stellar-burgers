import orderReducer, {
  getOrders,
  getOrderByNumber,
  getOrderBurger,
  initialState,
  ordersSlice
} from './orderSlice';

describe('orderSlice асинхронные действия', () => {
  test('вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером', () => {
    const state = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('обработка загрузки getOrderBurger.pending', () => {
    const action = { type: getOrderBurger.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка успешного выполнения getOrderBurger.fulfilled', () => {
    const orderMock = { id: '1', ingredients: [] };
    const action = {
      type: getOrderBurger.fulfilled.type,
      payload: orderMock
    };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      order: orderMock,
      isLoading: false
    });
  });

  test('обработка ошибки getOrderBurger.rejected', () => {
    const action = {
      type: getOrderBurger.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });

  test('обработка загрузки getOrderByNumber.pending', () => {
    const action = { type: getOrderByNumber.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка успешного выполнения getOrderByNumber.fulfilled', () => {
    const orderMock = {
      _id: '12345',
      status: 'done',
      name: 'Test Burger',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T01:00:00.000Z',
      number: 1,
      ingredients: ['ingredient1', 'ingredient2']
    };
    const action = {
      type: getOrderByNumber.fulfilled.type,
      payload: orderMock
    };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      order: orderMock,
      isLoading: false,
      error: null
    });
  });

  test('обработка ошибки getOrderByNumber.rejected', () => {
    const action = {
      type: getOrderByNumber.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });

  test('обработка загрузки getOrders.pending', () => {
    const action = { type: getOrders.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка успешного выполнения getOrders.fulfilled', () => {
    const ordersMock = [
      {
        _id: 'order1',
        status: 'done',
        name: 'Burger Order 1',
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T13:00:00.000Z',
        number: 1,
        ingredients: ['ingredient1', 'ingredient2']
      },
      {
        _id: 'order2',
        status: 'in progress',
        name: 'Burger Order 2',
        createdAt: '2023-01-02T12:00:00.000Z',
        updatedAt: '2023-01-02T13:00:00.000Z',
        number: 2,
        ingredients: ['ingredient3', 'ingredient4']
      }
    ];
    const action = { type: getOrders.fulfilled.type, payload: ordersMock };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orders: ordersMock,
      isLoading: false,
      error: null
    });
  });

  test('обработка ошибки getOrders.rejected', () => {
    const action = {
      type: getOrders.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = orderReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });
});

describe('orderSlice синхронные действия в reduses', () => {
  test('обработка действия orderModalDataAction', () => {
    const orderMock = {
      _id: '12345',
      status: 'done',
      name: 'Test Burger',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T01:00:00.000Z',
      number: 1,
      ingredients: ['ingredient1', 'ingredient2']
    };
    const action = ordersSlice.actions.orderModalDataAction(orderMock);
    const state = orderReducer(initialState, action);
    expect(state.order).toEqual(orderMock);
  });

  test('обработка действия clearOrderModalDataAction', () => {
    const stateWithOrder = {
      ...initialState,
      order: {
        _id: '12345',
        status: 'done',
        name: 'Test Burger',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T01:00:00.000Z',
        number: 1,
        ingredients: ['ingredient1', 'ingredient2']
      }
    };
    const action = ordersSlice.actions.clearOrderModalDataAction();
    const state = orderReducer(stateWithOrder, action);
    expect(state.order).toBeNull();
  });
});