import { envGlobal } from './envGlobal';

test('Private envGlobal.store should be undefined before we access envGlobal.store', () => {
    expect(envGlobal.store).toBeUndefined();
});
