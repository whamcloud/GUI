// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import * as fp from '@iml/fp';

import type { HighlandStreamT } from 'highland';

const empty = {};

export default function multiStream<T>(streams: HighlandStreamT<T>[]) {
  return highland(function(push) {
    const s: HighlandStreamT<mixed[]> = this;

    const data: any[] = fp.map(fp.always(empty))(streams);

    streams.forEach((s2: HighlandStreamT<T>, index: number) => {
      s.onDestroy(s2.destroy.bind(s2));

      s2.errors(e => push(e)).each((x: T) => {
        data[index] = x;

        if (data.indexOf(empty) === -1) push(null, [...data]);
      });
    });
  });
}
