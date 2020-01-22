export function loadDefaultReducer(): void {
    // Default ready reducer
    window.storeReducers.$$ready = (state: boolean = true): boolean => state;
}
