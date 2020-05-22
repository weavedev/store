import {
    Action,
    applyMiddleware,
    compose as defaultCompose,
    createStore,
    Middleware,
    Reducer,
    ReducersMapObject,
    StateFromReducersMapObject,
    Store,
} from 'redux';
import reduxLogger from 'redux-logger';
import reduxSaga, { Saga, SagaMiddleware } from 'redux-saga';
import { ForkEffect } from 'redux-saga/effects';
import { loadDefaultReducer } from './defaultReducer';
import { loadDefaultSaga } from './defaultSaga';
import { envGlobal } from './envGlobal';
import { watchWindowStoreReducers } from './reducers';
import { watchWindowStoreSagas } from './sagas';

export type SagasMapObject = {
    [key: string]: Saga;
};

export type StoreCreator = (...m: Middleware[]) => void;

interface ChangedReducerAction<T> extends Action<T> {
    reducer: string;
}

// Prepare store
export const init: StoreCreator = (...middlewares: Middleware[]): void => {
    // Add logger in compose when in dev-mode and extension is loaded and load middlewares
    const compose: <C>(a: C) => C = envGlobal.DEV_MODE ? envGlobal.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || defaultCompose : defaultCompose;
    const sagaMiddleware: SagaMiddleware = reduxSaga();

    // Prepare reducers and sagas objects
    envGlobal.storeReducers = envGlobal.storeReducers || {};
    envGlobal.storeSagas = envGlobal.storeSagas || {};

    // Load default reducer and saga
    loadDefaultReducer();
    loadDefaultSaga();

    // Watch envGlobal.storeReducers for changes and create store
    const s: Store<StoreState, StoreActions> = createStore(
        watchWindowStoreReducers(),
        compose(
            applyMiddleware(
                ...middlewares,
                sagaMiddleware,
                ...(envGlobal.DEV_MODE && !envGlobal.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? [reduxLogger] : []),
            ),
        ),
    );

    // Store existing sagas untill store is ready
    const existingSagas: StoreSagasMap = envGlobal.storeSagas;

    // Watch envGlobal.storeSagas for changes
    watchWindowStoreSagas(sagaMiddleware.run);

    // Bind store to window
    envGlobal.store = s;

    // Load existing sagas
    Object.keys(existingSagas).forEach((k: keyof StoreSagasMap) => {
        envGlobal.storeSagas[k] = existingSagas[k];
    });

    // Trigger saga init
    envGlobal.store.dispatch({ type: '$$SAGA_INIT' });
};

declare global {
    // Global interfaces for placing actions, reducers and sagas

    // tslint:disable:no-empty-interface
    interface StoreActionsMap {
        // Reducer helper actions
        $$SET_REDUCER: ChangedReducerAction<'$$SET_REDUCER'>;
        $$REMOVE_REDUCER: ChangedReducerAction<'$$REMOVE_REDUCER'>;

        // Saga init actions
        $$SAGA_INIT: Action<'$$SAGA_INIT'>;
        $$SAGA_READY: Action<'$$SAGA_READY'>;
    }
    interface StoreReducersMap extends ReducersMapObject {
        $$ready: Reducer<boolean>;
    }
    interface StoreSagasMap extends SagasMapObject {
        $$init(): IterableIterator<ForkEffect>;
    }
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

    namespace NodeJS {
        interface Process {
            // Allows the use of Redux DevTools when true
            DEV_MODE: boolean;

            store: Store<StoreState, StoreActions>;
            storeReducers: StoreReducersMap;
            storeSagas: StoreSagasMap;

            // Redux DevTools Chrome extension
            __REDUX_DEVTOOLS_EXTENSION_COMPOSE__<C>(a: C): C;
        }
    }
}
