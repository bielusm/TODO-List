import {
  addTodo,
  getAllTodos,
  addTodos,
  removeTodoAction,
  removeTodo,
  setTodo,
  setTodoAction
} from '../../src/actions/todo';
import configureMockStore from 'redux-mock-store';
import ReduxThunk from 'redux-thunk';
import moxios from 'moxios';
import { addAlert } from '../../src/actions/alert';
const mockStore = configureMockStore([ReduxThunk]);
import { uuid } from 'uuidv4';

const dummyTodos = [{ name: 'this is a todo', _id: 1 }];

jest.mock('uuidv4', () => ({
  __esModule: true,
  uuid: jest.fn(() => 1)
}));

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
    test('addTodo test', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.headers).toMatchObject({
          'x-auth-token': '12345',
          'Content-Type': 'application/json'
        });
        request.respondWith({ status: 200, responseText: 'Todo added' });
      });

      store
        .dispatch(addTodo({ name: 'name', description: 'description' }))
        .then(() => {
          const actions = store.getActions();
          let expected = addAlert(uuid(), 'Todo added', 'success');
          expect(actions[0]).toEqual(expected);
          done();
        });
    });

    test('should respond to bad request', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 400,
          response: { errors: [{ msg: 'Name required' }] }
        });
      });

      store
        .dispatch(addTodo({ name: 'name', description: 'description' }))
        .then(() => {
          const actions = store.getActions();
          let expected = addAlert(uuid(), 'Name required', 'danger');
          expect(actions[0]).toEqual(expected);
          done();
        });
    });
  });

  describe('get todos tests', () => {
    test('should get all todos', done => {
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

    test('should respond to bad request', async done => {
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
    test('should remove todo by ID', async done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200 });
      });

      const id = dummyTodos[0]._id;
      store.dispatch(removeTodoAction(id)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(
          expect.arrayContaining([
            addAlert(uuid(), 'Todo removed', 'success'),
            removeTodo(id)
          ])
        );
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
      store.dispatch(removeTodoAction(id)).then(() => {
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

      store.dispatch(setTodoAction(dummyTodos[0]._idid)).then(() => {
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
});
