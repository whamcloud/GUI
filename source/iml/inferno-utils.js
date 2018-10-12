// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { cloneVNode } from "inferno-clone-vnode";

export const cloneChildren = (xs: ?(React$Element<*>[] | React$Element<*>), fn: Function) => {
  if (xs == null) throw new Error("Expected Children");

  const children = Array.isArray(xs) ? xs : [xs];

  return children.map((x: React$Element<*>): React$Element<*> => cloneVNode(x, fn(x)));
};
