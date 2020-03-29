import todoReducer, { initialState } from '../../src/reducers/todo';
import {
  SET_TODOS,
  EDIT_TODO,
  SET_TODO,
  REMOVE_TODO_BY_ID,
  REMOVE_TODO,
  ADD_TODO,
  RESET_STATE,
  SET_TODO_LOADING
} from '../../src/actions/types';
import { mockTodos } from '../mocks/todos';

describe('todo reducer tests', () => {
  test('No type', () => {
    expect(todoReducer(undefined, {})).toEqual(initialState);
  });

  test('SET_TODOS', () => {
    expect(
      todoReducer(undefined, {
        type: SET_TODOS,
        payload: mockTodos
      })
    ).toEqual({ todo: null, todos: mockTodos, loading: false });
  });

  test('REMOVE_TODO_BY_ID', () => {
    const id = mockTodos[0]._id;
    expect(
      todoReducer(
        { todos: mockTodos },
        { type: REMOVE_TODO_BY_ID, payload: id }
      ).todos
    ).toEqual(expect.not.arrayContaining([mockTodos[0]]));
  });

  test('SET_TODO', () => {
    expect(
      todoReducer(undefined, { type: SET_TODO, payload: mockTodos[0] }).todo
    ).toEqual(mockTodos[0]);
  });

  test('Edit TODO', () => {
    const updates = { name: 'new name', description: 'new description' };
    expect(
      todoReducer(
        { todos: mockTodos },
        {
          type: EDIT_TODO,
          id: mockTodos[0]._id,
          payload: { ...updates }
        }
      ).todos.filter(todo => todo._id === mockTodos[0]._id)[0]
    ).toEqual(expect.objectContaining({ ...mockTodos[0], ...updates }));
  });

  test('REMOVE_TODO', () => {
    expect(
      todoReducer({ todo: mockTodos[0] }, { type: REMOVE_TODO }).todo
    ).toEqual(null);
  });

  test('ADD_TODO', () => {
    const result = todoReducer(
      { todos: [mockTodos[0]], loading: true },
      { type: ADD_TODO, payload: mockTodos[1] }
    );
    expect(result.todos).toEqual([mockTodos[0], mockTodos[1]]);
    expect(result.loading).toEqual(false);
  });

  test('RESET_STATE', () => {
    expect(
      todoReducer(
        { todos: [mockTodos], todo: mockTodos[0] },
        { type: RESET_STATE }
      )
    ).toEqual(initialState);
  });

  test('SET_TODO_LOADING', () => {
    expect(todoReducer(undefined, { type: SET_TODO_LOADING }).loading).toEqual(
      true
    );
  });
});
