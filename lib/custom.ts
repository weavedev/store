import {
    applyMiddleware,
    compose as defaultCompose,
    createStore,
    Middleware,
    ReducersMapObject,
    StateFromReducersMapObject,
    Store,
} from 'redux';
import reduxLogger from 'redux-logger';
import reduxSaga, { Saga, SagaMiddleware } from 'redux-saga';
import { loadDefaultReducer } from './defaultReducer';
import { loadDefaultSaga } from './defaultSaga';
import { watchWindowStoreReducers } from './reducers';
import { watchWindowStoreSagas } from './sagas';

export type SagasMapObject = {
    [key: string]: Saga;
};

export type StoreCreator = (...m: Middleware[]) => void;

// Prepare store
export const custom: StoreCreator = (...middlewares: Middleware[]): void => {
    // Add logger in compose when in dev-mode and extension is loaded and load middlewares
    const compose: <C>(a: C) => C = window.DEV_MODE ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || defaultCompose : defaultCompose;
    const sagaMiddleware: SagaMiddleware = reduxSaga();

    // Prepare reducers and sagas objects
    window.storeReducers = window.storeReducers || {};
    window.storeSagas = window.storeSagas || {};

    // Load default reducer and saga
    loadDefaultReducer();
    loadDefaultSaga();

    // Watch window.storeReducers for changes and create store
    const s: Store<StoreState, StoreActions> = createStore(
        watchWindowStoreReducers(),
        compose(
            applyMiddleware(
                sagaMiddleware,
                ...(window.DEV_MODE ? [reduxLogger] : []),
                ...middlewares,
            ),
        ),
    );

    // Store existing sagas untill store is ready
    const existingSagas: StoreSagasMap = window.storeSagas;

    // Watch window.storeSagas for changes
    watchWindowStoreSagas(sagaMiddleware.run);

    // Bind store to window
    window.store = s;

    // Load existing sagas
    Object.keys(existingSagas).forEach((k: keyof StoreSagasMap) => {
        window.storeSagas[k] = existingSagas[k];
    });

    // Trigger saga init
    window.store.dispatch({ type: '$$SAGA_INIT' });
};

declare global {
    // Global interfaces for placing actions, reducers and sagas

    // tslint:disable:no-empty-interface
    interface StoreActionsMap {}
    interface StoreReducersMap extends ReducersMapObject {}
    interface StoreSagasMap extends SagasMapObject {}
    // tslint:enable:no-empty-interface

    // All actions used by store
    type StoreActions = StoreActionsMap[keyof StoreActionsMap];
    // State of store object
    type StoreState = StateFromReducersMapObject<StoreReducersMap>;

    interface Window {
        // Allows the use of Redux DevTools when true
        DEV_MODE: boolean;

        store: Store<StoreState, StoreActions>;
        storeReducers: StoreReducersMap;
        storeSagas: StoreSagasMap;

        // Redux DevTools Chrome extension
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__<C>(a: C): C;
    }
}
