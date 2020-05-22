import { envGlobal } from './envGlobal';
import { init } from './init';

test('Private envGlobal.store should be set after we init', () => {
    init();
    expect(envGlobal.store).toBeDefined();
});
