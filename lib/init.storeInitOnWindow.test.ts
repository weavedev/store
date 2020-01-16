import { init } from './init';

test('Private window.store should be set after we init', () => {
    init();
    expect(window.store).toBeDefined();
});
