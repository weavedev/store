import { envGlobal } from './envGlobal';

envGlobal.DEV_MODE = true;

const logs: any[][] = [];
const mock: ((t: string) => ((...m: any[]) => void)) = (t: string): ((...m: any[]) => void) => (...m: any[]): void => {
    logs.push([t, m]);
};

console.group = mock('group');
console.log = mock('log');

import { store } from './store';

test('Store should log with DEV_MODE enabled', () => {
    // Store should already be initialized
    expect(store).toBeDefined();

    // Store should log when in DEV_MODE
    expect(JSON.stringify(logs).indexOf(`$$SAGA_INIT`)).toBeGreaterThanOrEqual(0);
});
