import { Reducer } from 'redux';

export function loadDefaultReducer(): void {
    // Default ready reducer
    window.storeReducers.$$ready = (state: boolean = true): boolean => state;
}

declare global {
    interface StoreReducersMap {
        $$ready: Reducer<boolean>;
    }
}
