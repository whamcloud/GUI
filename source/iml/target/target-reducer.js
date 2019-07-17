// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const ADD_TARGET_ITEMS = "ADD_TARGET_ITEMS";
export const DELETE_TARGET_ITEM = "DELETE_TARGET_ITEM";
export const UPDATE_TARGET_ITEM = "UPDATE_TARGET_ITEM";

export default function targetReducer(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_TARGET_ITEMS:
      return Immutable(payload);
    case UPDATE_TARGET_ITEM:
      return state.set(payload.id, payload);
    case DELETE_TARGET_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
