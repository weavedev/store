import { init } from './init';
init();

const existing: any = window.store;

import { store } from './';

test('Store is not created by main module if store already exists', () => {
    // Store should exist
    expect(store).toBeDefined();
    // Store should be bound to window
    expect(window.store).toBeDefined();
    // Store from import and store from window should be equal
    expect(store).toEqual(window.store);
    // Store from after init and imported store should be equal
    expect(store).toEqual(existing);
});
