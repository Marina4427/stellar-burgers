import userReducer, {
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
  getUser,
  initialState
} from './userSlice';

describe('UserSlice', () => {
  test('вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером', () => {
    const state = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('обработка загрузки registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка успешного выполнения registerUser.fulfilled', () => {
    const user = { id: 'user123', email: 'test@test.com' };
    const action = {
      type: registerUser.fulfilled.type,
      payload: {
        user,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      user,
      isLoading: false,
      error: null
    });
  });

  test('обработка ошибки registerUser.rejected', () => {
    const action = {
      type: registerUser.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });

  test('обработка загрузки loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка успешного выполнения loginUser.fulfilled', () => {
    const user = { id: 'user123', email: 'test@test.com' };
    const action = {
      type: loginUser.fulfilled.type,
      payload: {
        user,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      user,
      isLoading: false,
      error: null
    });
  });

  test('обработка ошибки loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });

  test('обработка загрузки logoutUser.pending', () => {
    const action = { type: logoutUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка успешного выполнения logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const state = userReducer(
      {
        ...initialState,
        user: { email: 'test@test.com', name: '' },
      },
      action
    );
    expect(state).toEqual({
      ...initialState,
      user: null,
      isLoading: false,
      error: null
    });
  });

  test('обработка ошибки logoutUser.rejected', () => {
    const action = {
      type: logoutUser.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });

  test('обработка загрузки updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка успешного выполнения updateUser.fulfilled', () => {
    const user = { id: 'user123', email: 'updated@test.com' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: {user}
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      user,
      isLoading: false,
      error: null
    });
  });

  test('обработка ошибки updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });

  test('обработка загрузки getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка успешного выполнения getUser.fulfilled', () => {
    const user = { id: 'user123', email: 'test@test.com' };
    const action = {
      type: getUser.fulfilled.type,
      payload: { user }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      user,
      isLoading: false,
      error: null
    });
  });

  test('обработка ошибки getUser.rejected', () => {
    const action = {
      type: getUser.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка',
      isLoading: false
    });
  });
});