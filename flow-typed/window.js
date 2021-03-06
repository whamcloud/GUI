// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

declare class Crypto {
  getRandomValues(p: Uint32Array): Uint32Array;
}

type cacheInitialDataT = {
  alert: mixed[],
  filesystem: mixed[],
  target: mixed[],
  host: mixed[],
  power_control_type: mixed[],
  server_profile: mixed[],
  lnet_configuration: mixed[],
  job: mixed[],
  session: Object
};

declare var window: {
  angular: mixed,
  clearTimeout: (id: TimeoutID | null) => void,
  document: Document,
  crypto: Crypto,
  fetch: window.fetch,
  STATIC_URL: string,
  CACHE_INITIAL_DATA: cacheInitialDataT,
  HELP_TEXT: {
    [key: string]: string
  },
  IS_RELEASE: boolean,
  dispatchEvent: Event => void,
  addEventListener: (evName: string, cb: (ev: Object) => any, useCapture?: boolean) => void,
  removeEventListener: (evName: string, cb: (ev: Object) => any, useCapture: boolean) => void,
  ALLOW_ANONYMOUS_READ: boolean,
  SERVER_TIME_DIFF: number,
  VERSION: string,
  BUILD: string,
  location: Location,
  requestAnimationFrame: (cb: Function) => number,
  Date: typeof Date,
  decodeURIComponent(str: string): string,
  Intl: {
    NumberFormat: (
      locales: string,
      opts: {
        maximumSignificantDigits?: number,
        maximumFractionDigits?: number,
        minimumSignificantDigits?: number
      }
    ) => Object
  },
  EventSource: typeof EventSource,
  wasm_bindgen: Function
};

declare module "../favicon.ico" {
  declare var exports: any;
}
