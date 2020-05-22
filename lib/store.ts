import { envGlobal } from './envGlobal';
import { init } from './init';

if (!envGlobal.store) {
    console.log('Automatically creating store on first store access from import');

    init();
}

export const store: Window['store'] = envGlobal.store;
