import { ForkEffect, put, PutEffect, takeLatest } from 'redux-saga/effects';
import { envGlobal } from './envGlobal';

export function loadDefaultSaga(): void {
    // Default ready saga
    envGlobal.storeSagas.$$init = function* watchInit(): IterableIterator<ForkEffect> {
        yield takeLatest('$$SAGA_INIT', function* (): IterableIterator<PutEffect> {
            yield put({ type: '$$SAGA_READY' });
        });
    };
}
