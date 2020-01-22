import { Action } from 'redux';
import { init } from './init';

beforeAll(() => {
    init();
});

test('Reducers can be added to store', () => {
    // Make sure reducer does not exist on start
    expect(window.storeReducers.testReducer1).toBeUndefined();
    // Add reducer
    window.storeReducers.testReducer1 = (s: string = 'default string', a: Action): string => `"${s}", "${a}"`;

    // Make sure reducer exists
    expect(window.storeReducers.testReducer1).toBeDefined();
    // Make sure state exists
    expect(typeof window.store.getState().testReducer1).toEqual('string');
});

test('Reducers can be removed from store', () => {
    // Add reducer
    window.storeReducers.testReducer2 = (s: string = 'default string', a: Action): string => `"${s}", "${a}"`;
    // Make sure reducer exists
    expect(window.storeReducers.testReducer2).toBeDefined();
    // Make sure state exists
    expect(typeof window.store.getState().testReducer2).toEqual('string');

    // Trigger redux
    window.store.dispatch({ type: '$$SAGA_READY' });

    // Delete reducer from store
    delete window.storeReducers.testReducer2;
    // Make sure reducer no longer exists
    expect(window.storeReducers.testReducer2).toBeUndefined();
    // Make sure state is removed
    expect(window.store.getState().testReducer2).toBeUndefined();
});

test('Reducers can be redefined on store and should reset state', () => {
    // Add reducer
    window.storeReducers.testReducer3 = (s: number = 1): number => s * 2;
    // Make sure reducer exists
    expect(window.storeReducers.testReducer3).toBeDefined();
    // Make sure state exists
    expect(window.store.getState().testReducer3).toEqual(2);

    // Trigger redux
    window.store.dispatch({ type: '$$SAGA_READY' });
    // Make sure state exists
    expect(window.store.getState().testReducer3).toEqual(4);

    // Redefine reducer from store
    window.storeReducers.testReducer3 = (s: number = 1): number => s * 3;
    // Make sure reducer exists
    expect(window.storeReducers.testReducer3).toBeDefined();

    // Make sure state was reset
    expect(window.store.getState().testReducer3).toEqual(3);

    // Trigger redux
    window.store.dispatch({ type: '$$SAGA_READY' });
    // Make sure state was reset
    expect(window.store.getState().testReducer3).toEqual(9);
});

test('Reducers can be removed from store before being triggered', () => {
    // Add reducer
    window.storeReducers.testReducer4 = (s: string = 'default string', a: Action): string => `"${s}", "${a}"`;
    // Make sure reducer exists
    expect(window.storeReducers.testReducer4).toBeDefined();

    // Delete reducer from store
    delete window.storeReducers.testReducer4;
    // Make sure reducer no longer exists
    expect(window.storeReducers.testReducer4).toBeUndefined();
    // Make sure state is removed
    expect(window.store.getState().testReducer4).toBeUndefined();
});

test('If a non-existing reducer is removed it should not throw', (done: (() => void)) => {
    expect(() => {
        delete window.storeReducers.nonExisting;
        done();
    }).not.toThrow();
});

test('If a reducer is added without a key it should not be added', () => {
    // @ts-ignore
    window.storeReducers[''] = (): void => void 0;

    // Make sure that the reducer was not added
    expect(window.storeReducers['']).toBeUndefined();
});
