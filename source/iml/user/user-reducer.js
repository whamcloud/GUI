// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ADD_USER_ITEMS = 'ADD_USER_ITEMS';

import type { ActionT } from '../store/store-module.js';

export default function(state: Array<Object> = [], { type, payload }: ActionT): Array<Object> {
  switch (type) {
    case ADD_USER_ITEMS:
      return payload;
    default:
      return state;
  }
}
