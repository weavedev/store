import { ForkEffect, put, PutEffect, takeLatest } from 'redux-saga/effects';

export function loadDefaultSaga(): void {
    // Default ready saga
    window.storeSagas.$$init = function* watchInit(): IterableIterator<ForkEffect> {
        yield takeLatest('$$SAGA_INIT', function* (): IterableIterator<PutEffect> {
            yield put({ type: '$$SAGA_READY' });
        });
    };
}
