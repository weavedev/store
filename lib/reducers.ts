import { combineReducers, Reducer } from 'redux';
import { envGlobal } from './envGlobal';

type StoreReducer = Reducer<StoreState, StoreActions>;
type StoreKey = number | string;

export function watchWindowStoreReducers(): StoreReducer {
    // Place to keep removed reducer keys untill we are able to clean up when redux recalculates its store state
    let deletedReducers: StoreKey[] = [];
    // Constructed reducer
    let storeReducer: StoreReducer = combineReducers(envGlobal.storeReducers);
    // Wrap window reducers object and copy existing reducers
    envGlobal.storeReducers = new Proxy(envGlobal.storeReducers, {
        deleteProperty(target: StoreReducersMap, k: string | symbol): boolean {
            if (k === undefined || !target[<keyof StoreReducersMap>k]) {
                return true;
            }

            delete target[<keyof StoreReducersMap>k]; // tslint:disable-line:no-dynamic-delete

            // Clearing the state for the deleted reducer.
            deletedReducers.push(<keyof StoreReducersMap>k);

            storeReducer = combineReducers(envGlobal.storeReducers);

            envGlobal.store.dispatch({ type: '$$REMOVE_REDUCER', reducer: `${String(k)}` });

            return true;
        },
        set(target: StoreReducersMap, k: string | symbol, value: any): boolean {
            if (k === undefined || k === '') {
                return true;
            }

            // Clearing the state for the new reducer. (Preserving state should be done manually)
            if (target[<keyof StoreReducersMap>k]) {
                deletedReducers.push(<keyof StoreReducersMap>k);
            }

            // @ts-ignore
            target[<keyof StoreReducersMap>k] = value; // tslint:disable-line:no-unsafe-any

            storeReducer = combineReducers(envGlobal.storeReducers);

            envGlobal.store.dispatch({ type: '$$SET_REDUCER', reducer: `${String(k)}` });

            return true;
        },
    });

    // Main reducer
    return (state: StoreState | undefined, action: StoreActions): StoreState => {
        const newState: StoreState = <StoreState>{ ...state }; // tslint:disable-line:no-object-literal-type-assertion
        if (deletedReducers.length > 0) {
            deletedReducers.forEach((k: StoreKey): void => {
                delete newState[k]; // tslint:disable-line:no-dynamic-delete
            });
            deletedReducers = [];
        }

        return storeReducer(newState, action);
    };
}
