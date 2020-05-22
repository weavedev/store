import { CallEffect, delay } from 'redux-saga/effects';
import { envGlobal } from './envGlobal';
import { init } from './init';

beforeEach(() => {
    init();
});

let triggeredStoreSaga1: boolean = false;
test('Sagas can be added to store', () => {
    // Make sure saga does not exist on start
    expect(envGlobal.storeSagas.testSaga1).toBeUndefined();
    // Add saga
    envGlobal.storeSagas.testSaga1 = function* (): IterableIterator<void> {
        triggeredStoreSaga1 = true;
    };

    // Make sure saga exists
    expect(envGlobal.storeSagas.testSaga1).toBeDefined();
    // Make sure saga ran
    expect(triggeredStoreSaga1).toEqual(true);
});

let triggeredStoreSaga2: boolean = false;
let cancelledStoreSaga2: boolean = true;
test('Sagas can be removed from store and jobs are cancelled', (done: (() => void)) => {
    // Make sure saga does not exist on start
    expect(envGlobal.storeSagas.testSaga2).toBeUndefined();
    // Add saga
    envGlobal.storeSagas.testSaga2 = function* (): IterableIterator<CallEffect> {
        triggeredStoreSaga2 = true;
        yield delay(300);
        cancelledStoreSaga2 = false;
    };

    // Make sure saga exists
    expect(envGlobal.storeSagas.testSaga2).toBeDefined();
    // Make sure first part of saga ran
    expect(triggeredStoreSaga2).toEqual(true);

    // Remove saga from store
    delete envGlobal.storeSagas.testSaga2;

    setTimeout(() => {
        expect(cancelledStoreSaga2).toEqual(true);
        done();
    }, 500);
});

test('If a non-existing saga is removed it should not throw', (done: (() => void)) => {
    expect(() => {
        delete envGlobal.storeSagas.nonExisting;
        done();
    }).not.toThrow();
});

test('If a saga is added without a key it should not be added', () => {
    // @ts-ignore
    envGlobal.storeSagas[''] = (): void => void 0;

    // Make sure that the reducer was not added
    expect(envGlobal.storeSagas['']).toBeUndefined();
});
