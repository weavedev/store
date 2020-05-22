import { envGlobal } from './envGlobal';

test('Expect envGlobal to be process or window.', () => {
    const test: symbol = Symbol('test');

    // @ts-ignore
    envGlobal.trackerVariable = test;

    // tslint:disable-next-line:no-typeof-undefined
    if (typeof window === 'undefined') {
        // @ts-ignore
        expect(process.trackerVariable).toEqual(test);
    } else {
        // @ts-ignore
        expect(window.trackerVariable).toEqual(test);
    }
});
