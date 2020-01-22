# store

[![Build Status - Travis CI](https://img.shields.io/travis/weavedev/store.svg)](https://travis-ci.org/weavedev/store)
[![Test Coverage - Code Climate](https://img.shields.io/codeclimate/coverage/weavedev/store.svg)](https://codeclimate.com/github/weavedev/store/test_coverage)
[![GPL-3.0](https://img.shields.io/github/license/weavedev/store.svg)](https://github.com/weavedev/store/blob/master/LICENSE)
[![NPM](https://img.shields.io/npm/v/@weavedev/store.svg)](https://www.npmjs.com/package/@weavedev/store)

Opinionated drop-in [Redux](http://redux.js.org/) store with [Redux-Saga](https://redux-saga.js.org)

## Install

```
npm i @weavedev/store
```

## API documentation

We generate API documentation with [TypeDoc](https://typedoc.org).

[![API Documentation](https://img.shields.io/badge/API-Documentation-blue?style=for-the-badge&logo=typescript)](https://weavedev.github.io/store/)

## Usage

### Initialization

#### Basic initialization

The recommended way to create the `store` is with the `init()` function.

```ts
import { init } from '@weavedev/store/init';

init();
```

#### Custom initialization with middlewares

If you want to use your own middlewares you can pass them as arguments.

```ts
import { init } from '@weavedev/store/init';
import { logger, router, uploader } from './middlewares';

init(logger, router, uploader);
```

#### Automatic initialization

When the `store` object is imported and `window.store` has not already been initialized this package will initialize it for you.

```ts
import { store } from '@weavedev/store';
```

###### NOTE

The purpose of automatic initialization and the importable `store` object are to provide an easy way to migrate an existing project. Manually initializing the store is recommended.

### Reducers

#### Adding reducers

Adding reducers to the `window.storeReducers` object registers them on the `store` and allows you to dispatch actions on them.

```ts
import { Action, Reducer } from 'redux';

// Clear message action
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
type ClearMessage = Action<typeof CLEAR_MESSAGE>;
export const clearMessage = (): ClearMessage => ({
    type: CLEAR_MESSAGE,
});

// Set message action
export const SET_MESSAGE = 'SET_MESSAGE';
interface SetMessage extends Action<typeof SET_MESSAGE> {
    message: string;
}
export const setMessage = (message: string): SetMessage => ({
    type: SET_MESSAGE,
    message,
});

// Message reducer
window.storeReducers.myMessageReducer = (state: string = 'default value', action: StoreActions): string => {
    switch(action.type) {
        case 'CLEAR_MESSAGE':
            return '';
        case 'SET_MESSAGE':
            return action.message;
        default:
            return state;
    }
};

declare global {
    interface StoreReducersMap {
        myMessageReducer: Reducer<string, StoreActions>;
    }

    interface StoreActionsMap {
        myMessageReducer: SetMessage | ClearMessage;
    }
}
```

#### Removing reducers

After removing a reducer from `window.storeReducers` it will no longer listen to dispatched actions. After a reducer is removed from `window.storeReducers` its state will be removed.

```ts
delete window.storeReducers.myMessageReducer;
```

### Sagas

#### Adding sagas

Adding sagas to the `window.storeSagas` object registers them on the `store` and runs them to start listening to dispatched actions.

```ts
import { call, takeLatest } from 'redux-saga/effects';
import { SetMessage } from './myMessageReducer';

// Message saga
window.storeSagas.myMessageSaga = function* (): Iterator<any> {
    yield takeLatest('SET_MESSAGE', function* (action: SetMessage): Iterator<any> {
        yield call(console.log, action.message);
    });
};
```

#### Removing sagas

After removing a saga from `window.storeSagas` it will no longer listen to dispatched actions and if the saga is running it will be cancelled.

```ts
delete window.storeSagas.myMessageSaga;
```

### Global types

This package provides the following global types

#### `StoreActions`

Any actions known to the store. Useful when creating reducers.

```ts
function myReducer(state: string, action: StoreActions): string {
    // ...
}
```

#### `StoreActionsMap`

Any actions you want to use with the store you can add to the `StoreActionsMap`. These actions will be available on the global `StoreActions` type.

```ts
declare global {
    interface StoreActionsMap {
        myReducer: Action<'MY_ACTION'>;
    }
}
```

#### `StoreReducersMap`

Any reducers you want to use with the store you can add to the `StoreReducersMap`. This wil also bind the types to `StoreState`.

```ts
declare global {
    interface StoreReducersMap {
        myReducer: Reducer<string, StoreActions>;
    }
}
```

#### `StoreSagasMap`

It exists. You will probably not need it. But just in case you are looking for it, here it is.

```ts
declare global {
    interface StoreSagasMap {
        mySaga: Saga;
    }
}
```

#### `StoreState`

The `StoreState` type describes the return type of `window.store.getState()`. Useful when using stored values.

```ts
const state: StoreState = window.store.getState();
```

### Logging

Setting `window.DEV_MODE` to `true` before initializing will enable logging in the console and with the [Chrome Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en).

```ts
import { init } from '@weavedev/store/init';

window.DEV_MODE = true;

init();
```

## License

[GPL-3.0](https://github.com/weavedev/store/blob/master/LICENSE)

Made by [Paul Gerarts](https://github.com/gerarts) and [Weave](https://weave.nl)
