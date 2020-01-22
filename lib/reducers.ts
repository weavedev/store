import { combineReducers, Reducer } from 'redux';

type StoreReducer = Reducer<StoreState, StoreActions>;
type StoreKey = number | string;

export function watchWindowStoreReducers(): StoreReducer {
    // Place to keep removed reducer keys untill we are able to clean up when redux recalculates its store state
    let deletedReducers: StoreKey[] = [];
    // Constructed reducer
    let storeReducer: StoreReducer = combineReducers(window.storeReducers);
    // Wrap window reducers object and copy existing reducers
    window.storeReducers = new Proxy(window.storeReducers, {
        deleteProperty(target: StoreReducersMap, k: keyof StoreReducersMap): boolean {
            if (k === undefined || !target[k]) {
                return true;
            }

            delete target[k]; // tslint:disable-line:no-dynamic-delete

            // Clearing the state for the deleted reducer.
            deletedReducers.push(k);

            storeReducer = combineReducers(window.storeReducers);

            if (window.store !== undefined) {
                window.store.dispatch({ type: '$$REMOVE_REDUCER', reducer: `${String(k)}` });
            }

            return true;
        },
        set<K extends keyof StoreReducersMap>(target: StoreReducersMap, k: K, value: StoreReducersMap[K]): boolean {
            if (k === undefined || k === '') {
                return true;
            }

            // Clearing the state for the new reducer. (Preserving state should be done manually)
            if (target[k]) {
                deletedReducers.push(k);
            }

            target[k] = value;

            storeReducer = combineReducers(window.storeReducers);

            if (window.store !== undefined) {
                window.store.dispatch({ type: '$$SET_REDUCER', reducer: `${String(k)}` });
            }

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
