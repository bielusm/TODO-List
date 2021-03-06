import {
  addTodoAction,
  addTodo,
  getAllTodos,
  addTodos,
  removeTodoByIdAction,
  editTodo,
  editTodoAction,
  setTodo,
  setTodoAction,
  removeTodoById
} from '../../src/actions/todo';
import configureMockStore from 'redux-mock-store';
import ReduxThunk from 'redux-thunk';
import moxios from 'moxios';
import { addAlert } from '../../src/actions/alert';
import { uuid } from 'uuidv4';
import { mockTodos } from '../mocks/todos';
import { SET_TODO_LOADING } from '../../src/actions/types';
const dummyTodos = [{ name: 'this is a todo', _id: 1 }];

jest.mock('uuidv4', () => ({
  __esModule: true,
  uuid: jest.fn(() => 1)
}));

const mockStore = configureMockStore([ReduxThunk]);
let store;
beforeEach(() => {
  store = mockStore({
    user: {
      token: '12345',
      authenticated: false
    }
  });
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

describe('Todo action tests', () => {
  describe('addTodo tests', () => {
    it('should add todo', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.headers).toMatchObject({
          'x-auth-token': '12345',
          'Content-Type': 'application/json'
        });
        request.respondWith({
          status: 200,
          response: { name: 'todo 1', description: 'todo description', id: 1 }
        });
      });

      store
        .dispatch(addTodoAction({ name: 'name', description: 'description' }))
        .then(() => {
          const actions = store.getActions();
          let expected = [
            { type: 'SET_TODO_LOADING' },
            addTodo({ name: 'todo 1', description: 'todo description', id: 1 }),
            addAlert(uuid(), 'Todo added', 'success')
          ];
          expect(actions).toEqual(expected);
          done();
        });
    });

    it('should respond to bad request', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 400,
          response: { errors: [{ msg: 'Name required' }] }
        });
      });

      store
        .dispatch(addTodoAction({ name: 'name', description: 'description' }))
        .then(() => {
          const actions = store.getActions();
          let expected = [
            { type: SET_TODO_LOADING },
            addAlert(uuid(), 'Name required', 'danger')
          ];
          expect(actions).toEqual(expected);
          done();
        });
    });
  });

  describe('get todos tests', () => {
    it('should get all todos', done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.headers).toMatchObject({
          'x-auth-token': '12345'
        });
        request.respondWith({ status: 200, response: dummyTodos });
      });

      store.dispatch(getAllTodos()).then(() => {
        const actions = store.getActions();
        let expected = addTodos(dummyTodos);
        expect(actions[0]).toEqual(expected);
        done();
      });
    });

    it('should respond to bad request', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 400,
          response: { errors: [{ msg: 'Name required' }] }
        });
      });

      store.dispatch(getAllTodos()).then(() => {
        const actions = store.getActions();
        let expected = addAlert(uuid(), 'Name required', 'danger');
        expect(actions[0]).toEqual(expected);
        done();
      });
    });
  });

  describe('Remove todo tests', () => {
    it('should remove todo by ID', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200 });
      });

      const id = dummyTodos[0]._id;
      store.dispatch(removeTodoByIdAction(id)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(
          expect.arrayContaining([
            addAlert(uuid(), 'Todo removed', 'success'),
            removeTodoById(id)
          ])
        );
        done();
      });
    });

    it('should respond to bad request', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 400,
          response: { errors: [{ msg: 'Invalid Todo ID' }] }
        });
      });

      const id = dummyTodos[0]._id;
      store.dispatch(removeTodoByIdAction(id)).then(() => {
        const actions = store.getActions();
        const expected = addAlert(uuid(), 'Invalid Todo ID', 'danger');
        expect(actions).toEqual([expected]);
        done();
      });
    });
  });

  describe('Set Todo tests', () => {
    it('should set todo', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: dummyTodos[0]
        });
      });

      store.dispatch(setTodoAction(dummyTodos[0]._id)).then(() => {
        const actions = store.getActions();
        const expected = setTodo(dummyTodos[0]);
        expect(actions).toEqual([expected]);
        done();
      });
    });

    test('should respond to bad request', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 400,
          response: { errors: [{ msg: 'Invalid Todo ID' }] }
        });
      });

      const id = dummyTodos[0]._id;
      store.dispatch(setTodoAction(id)).then(() => {
        const actions = store.getActions();
        const expected = addAlert(uuid(), 'Invalid Todo ID', 'danger');
        expect(actions).toEqual([expected]);
        done();
      });
    });
  });

  describe('edit todo tests', () => {
    test('should edit todo', async done => {
      const todoUpdates = { name: 'new name', description: 'new description' };
      const id = mockTodos[0]._id;

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.headers).toMatchObject({
          'Content-Type': 'application/json'
        });
        request.respondWith({ status: 200, response: todoUpdates });
      });

      store.dispatch(editTodoAction(id, todoUpdates)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual([editTodo(id, todoUpdates)]);
        done();
      });
    });

    test('should respond to bad request', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 400,
          response: { errors: [{ msg: 'Invalid Todo ID' }] }
        });
      });

      const updates = { name: 'new name', description: 'new description' };
      store.dispatch(editTodoAction(mockTodos[0]._id, updates)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual([
          addAlert(uuid(), 'Invalid Todo ID', 'danger')
        ]);
        done();
      });
    });
  });
});
