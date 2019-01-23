// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import Backoff from "backo";
import global from "../global.js";
import { SSE } from "../environment.js";

const backoff = new Backoff({ min: 100, max: 20000 });

export default () =>
  highland((push, next) => {
    const sse = new global.EventSource(SSE);

    sse.onopen = () => {
      backoff.reset();
    };

    sse.onerror = e => {
      // pass errors along but don't end the stream
      if (e.currentTarget.readyState === 2)
        setTimeout(() => {
          sse.close();
          next();
        }, backoff.duration());

      push(new Error("An error occurred on the event source."));
    };

    sse.onmessage = (msg: SSEEventT) => {
      try {
        const data = JSON.parse(msg.data);
        push(null, data);
      } catch (e) {
        push(e);
      }
    };
  });
