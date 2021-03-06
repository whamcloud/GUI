// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as obj from "@iml/obj";
import * as fp from "@iml/fp";

import type { HighlandStreamT } from "highland";

type Point = {|
  data: {|
    [key: string]: number
  |},
  ts: string
|};

type Sum = (xs: Array<Point[]>) => Point[];
const sum: Sum = fp.map(
  fp.chainL((a: Point, b: Point) =>
    obj.entries(b.data).reduce(
      (o: Point, [k: string, v: number]): Point => ({
        ...o,
        data: {
          ...o.data,
          [k]: (o.data[k] || 0) + v
        }
      }),
      { ...a }
    )
  )
);

type Stat$ = HighlandStreamT<Point>;
export default (s: Stat$): Stat$ =>
  s
    .group("ts")
    .map(
      fp.flow(
        obj.values,
        sum
      )
    )
    .flatten();
