// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const CONFIRM_ACTION = "CONFIRM_ACTION";
export const CLEAR_CONFIRM_ACTION = "CLEAR_CONFIRM_ACTION";

import Immutable from "seamless-immutable";

export type ConfirmActionPayloadT = {|
  action: Function,
  message: string,
  prompts: string[],
  required: boolean,
  label: string
|};

export type ConfirmActionT = {|
  type: typeof CONFIRM_ACTION,
  payload: ConfirmActionPayloadT
|};

type stateT = ConfirmActionPayloadT | {};

export default function(state: stateT = Immutable({}), { type, payload }: ConfirmActionT): stateT {
  switch (type) {
    case CONFIRM_ACTION:
      return Immutable(payload);
    case CLEAR_CONFIRM_ACTION:
      return Immutable({});
    default:
      return state;
  }
}
