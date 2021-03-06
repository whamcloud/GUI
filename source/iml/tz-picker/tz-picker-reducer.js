// @flow

export const SET_TIME_ZONE = "SET_TIME_ZONE";

import Immutable from "seamless-immutable";

import type { ActionT } from "../store/store-module.js";

export type TzPickerProps = {
  isUtc: boolean
};

export default function(state: TzPickerProps = Immutable({ isUtc: false }), { type, payload }: ActionT): TzPickerProps {
  switch (type) {
    case SET_TIME_ZONE:
      return Immutable({
        isUtc: payload
      });
    default:
      return state;
  }
}
