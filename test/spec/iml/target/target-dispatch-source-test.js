import highland from 'highland';
import {mock, resetAll} from '../../../system-mock.js';

describe('target dispatch source', () => {
  let store, stream, socketStream;

  beforeEachAsync(async function () {
    const CACHE_INITIAL_DATA = {
      target: ['targets'],
      host: ['host']
    };

    stream = highland();

    socketStream = jasmine
      .createSpy('highland')
      .and
      .returnValue(stream);

    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    const targetDispatchFactory = await mock('source/iml/target/target-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store },
      'source/iml/environment': { CACHE_INITIAL_DATA }
    });

    targetDispatchFactory.default(socketStream);
  });

  afterEach(resetAll);

  it('should dispatch cached targets into the store', () => {
    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_TARGET_ITEMS',
      payload: ['targets']
    });
  });

  it('should setup a persistent socket to /targets', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/target', {
      qs: {
        limit: 0
      }
    });
  });

  it('should update targets when new items arrive from a persistent socket', () => {
    stream.write({
      objects: ['more targets']
    });

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_TARGET_ITEMS',
      payload: ['more targets']
    });
  });
});
