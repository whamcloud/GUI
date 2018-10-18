// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { cloneVNode } from "inferno-clone-vnode";

const flatten = (xs: {} | any[]): any[] => {
  const items = Array.isArray(xs) ? xs : [xs];
  return items.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
};

type ReactElementOrReactElements = React$Element<*>[] | React$Element<*>;
const toReactElements = (xs: ReactElementOrReactElements) => (Array.isArray(xs) ? xs : [xs]);

export const cloneChildren = (xs: ?ReactElementOrReactElements, fn: Function) => {
  if (xs == null) throw new Error("Expected Children");

  const children = xs |> toReactElements |> flatten;

  return children.map((x: React$Element<*>): React$Element<*> => cloneVNode(x, fn(x)));
};
