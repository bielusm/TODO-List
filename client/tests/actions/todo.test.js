import user from '../../src/reducers/user';
import { addTodo } from '../../src/actions/todo';
import { setAlert } from '../../src/actions/alert';
import configureMockStore from 'redux-mock-store';
import ReduxThunk from 'redux-thunk';
import moxios from 'moxios';
import { addAlert } from '../../src/actions/alert';
const mockStore = configureMockStore([ReduxThunk]);
import { uuid } from 'uuidv4';

jest.mock('uuidv4', () => ({
  __esModule: true,
  uuid: jest.fn(() => 1)
}));

describe('Todo action tests', () => {
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
