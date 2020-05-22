import { envGlobal } from './envGlobal';

export function loadDefaultReducer(): void {
    // Default ready reducer
    envGlobal.storeReducers.$$ready = (state: boolean = true): boolean => state;
}
