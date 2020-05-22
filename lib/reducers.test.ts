import { Action } from 'redux';
import { envGlobal } from './envGlobal';
import { init } from './init';

beforeAll(() => {
    init();
});

test('Reducers can be added to store', () => {
    // Make sure reducer does not exist on start
    expect(envGlobal.storeReducers.testReducer1).toBeUndefined();
    // Add reducer
    envGlobal.storeReducers.testReducer1 = (s: string = 'default string', a: Action): string => `"${s}", "${a}"`;

    // Make sure reducer exists
    expect(envGlobal.storeReducers.testReducer1).toBeDefined();
    // Make sure state exists
    expect(typeof envGlobal.store.getState().testReducer1).toEqual('string');
});

test('Reducers can be removed from store', () => {
    // Add reducer
    envGlobal.storeReducers.testReducer2 = (s: string = 'default string', a: Action): string => `"${s}", "${a}"`;
    // Make sure reducer exists
    expect(envGlobal.storeReducers.testReducer2).toBeDefined();
    // Make sure state exists
    expect(typeof envGlobal.store.getState().testReducer2).toEqual('string');

    // Trigger redux
    envGlobal.store.dispatch({ type: '$$SAGA_READY' });

    // Delete reducer from store
    delete envGlobal.storeReducers.testReducer2;
    // Make sure reducer no longer exists
    expect(envGlobal.storeReducers.testReducer2).toBeUndefined();
    // Make sure state is removed
    expect(envGlobal.store.getState().testReducer2).toBeUndefined();
});

test('Reducers can be redefined on store and should reset state', () => {
    // Add reducer
    envGlobal.storeReducers.testReducer3 = (s: number = 1): number => s * 2;
    // Make sure reducer exists
    expect(envGlobal.storeReducers.testReducer3).toBeDefined();
    // Make sure state exists
    expect(envGlobal.store.getState().testReducer3).toEqual(2);

    // Trigger redux
    envGlobal.store.dispatch({ type: '$$SAGA_READY' });
    // Make sure state exists
    expect(envGlobal.store.getState().testReducer3).toEqual(4);

    // Redefine reducer from store
    envGlobal.storeReducers.testReducer3 = (s: number = 1): number => s * 3;
    // Make sure reducer exists
    expect(envGlobal.storeReducers.testReducer3).toBeDefined();

    // Make sure state was reset
    expect(envGlobal.store.getState().testReducer3).toEqual(3);

    // Trigger redux
    envGlobal.store.dispatch({ type: '$$SAGA_READY' });
    // Make sure state was reset
    expect(envGlobal.store.getState().testReducer3).toEqual(9);
});

test('Reducers can be removed from store before being triggered', () => {
    // Add reducer
    envGlobal.storeReducers.testReducer4 = (s: string = 'default string', a: Action): string => `"${s}", "${a}"`;
    // Make sure reducer exists
    expect(envGlobal.storeReducers.testReducer4).toBeDefined();

    // Delete reducer from store
    delete envGlobal.storeReducers.testReducer4;
    // Make sure reducer no longer exists
    expect(envGlobal.storeReducers.testReducer4).toBeUndefined();
    // Make sure state is removed
    expect(envGlobal.store.getState().testReducer4).toBeUndefined();
});

test('If a non-existing reducer is removed it should not throw', (done: (() => void)) => {
    expect(() => {
        delete envGlobal.storeReducers.nonExisting;
        done();
    }).not.toThrow();
});

test('If a reducer is added without a key it should not be added', () => {
    // @ts-ignore
    envGlobal.storeReducers[''] = (): void => void 0;

    // Make sure that the reducer was not added
    expect(envGlobal.storeReducers['']).toBeUndefined();
});
