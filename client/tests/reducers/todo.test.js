import todoReducer, { initialState } from '../../src/reducers/todo';
import { SET_TODOS, REMOVE_TODO } from '../../src/actions/types';
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

  test('REMOVE_TODO', () => {
    const id = mockTodos[0]._id;
    expect(
      todoReducer({ todos: mockTodos }, { type: REMOVE_TODO, payload: id })
        .todos
    ).toEqual(expect.not.arrayContaining([mockTodos[0]]));
  });
});
