import { init } from './init';

if (!window.store) {
    console.log('Automatically creating store on first store access from import');

    init();
}

export const store: Window['store'] = window.store;
