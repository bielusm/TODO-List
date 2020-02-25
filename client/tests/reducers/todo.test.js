import todoReducer, { initialState } from '../../src/reducers/todo';
import { SET_TODOS } from '../../src/actions/types';
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
    ).toEqual({ todos: mockTodos });
  });
});
