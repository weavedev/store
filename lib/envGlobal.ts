// tslint:disable-next-line:no-typeof-undefined
export const envGlobal: Window | NodeJS.Process = typeof window === 'undefined' ? process : window;
