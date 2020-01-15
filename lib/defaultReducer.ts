import { Action, Reducer } from 'redux';

export function loadDefaultReducer(): void {
    // Default ready reducer
    window.storeReducers.$$ready = (state: boolean = false, action: StoreActions): boolean => {
        switch(action.type) {
            case '@@INIT':
                return true;
            default:
                return state;
        }
    };
}

declare global {
    interface StoreActionsMap {
        $$ready: Action<'@@INIT'>;
    }

    interface StoreReducersMap {
        $$ready: Reducer<boolean>;
    }
}
