import { addTodo } from '../../src/actions/todo';
import { setAlert } from '../../src/actions/alert';
import configureStore from 'redux-mock-store';
import ReduxThunk from 'redux-thunk';
import moxios from 'moxios';
import { addAlert } from '../../src/actions/alert';
const mockStore = configureStore([ReduxThunk]);
import { uuid } from 'uuidv4';

jest.mock('uuidv4', () => ({
  __esModule: true,
  uuid: jest.fn(() => 1)
}));

describe('Todo action tests', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('addTodo test', async done => {
    const store = mockStore({});

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({ status: 200, responseText: 'Todo added' });
    });

    store.dispatch(addTodo({ name: 'name' })).then(() => {
      const actions = store.getActions();
      let expected = addAlert(uuid(), 'Todo added', 'success');
      expect(actions[0]).toEqual(expected);
      done();
    });
  });
});
