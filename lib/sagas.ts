import { Saga, SagaMiddleware, Task } from 'redux-saga';

export function watchWindowStoreSagas(run: SagaMiddleware['run']): void {
    // Map to store running sagas
    const storeSagas: Map<keyof StoreSagasMap, Task> = new Map();
    // Wrap window sagas object and copy existing sagas
    window.storeSagas = new Proxy(
        // @ts-ignore
        {},
        {
            deleteProperty(target: StoreSagasMap, k: keyof StoreSagasMap): boolean {
                if (k === undefined || !target[k]) {
                    return true;
                }

                if (storeSagas.has(k)) {
                    const existingSaga: Task | undefined = storeSagas.get(k);
                    if (existingSaga) {
                        existingSaga.cancel();
                    }
                }

                delete target[k]; // tslint:disable-line:no-dynamic-delete

                return true;
            },
            set<K extends keyof StoreSagasMap>(target: StoreSagasMap, k: K, value: Saga): boolean {
                if (k === undefined || k === '') {
                    return true;
                }

                if (target[k] && storeSagas.has(k)) {
                    const existingSaga: Task | undefined = storeSagas.get(k);
                    if (existingSaga) {
                        existingSaga.cancel();
                    }
                }

                storeSagas.set(k, run(value));

                target[k] = value;

                return true;
            },
        },
    );
}
