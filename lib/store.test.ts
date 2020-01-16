const logs: any[][] = [];
console.log = (...m: any[]): void => {
    logs.push(m);
};

import { store } from './';

test('Store is automatically created on window when imported from the main module', () => {
    // Store should be created automatically
    expect(store).toBeDefined();
    // Store should be bound to window
    expect(window.store).toBeDefined();
    // Store from import and store from window should be equal
    expect(store).toEqual(window.store);
    // Expect log about automatically created store
    expect(logs).toEqual([['Automatically creating store on first store access from import']]);
});
