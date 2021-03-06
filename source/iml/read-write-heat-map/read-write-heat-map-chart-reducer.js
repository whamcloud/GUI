// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS = "UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS";
export const DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS = "DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS";

import Immutable from "seamless-immutable";

import type {
  heatMapPayloadHashT,
  addReadWriteHeatMapActionT,
  heatMapDurationPayloadT
} from "./read-write-heat-map-module.js";

function mergeState(state: heatMapPayloadHashT, payload: heatMapDurationPayloadT) {
  return Immutable.merge(state, {
    [payload.page]: { ...state[payload.page], ...payload }
  });
}

export default function(
  state: heatMapPayloadHashT = Immutable({}),
  { type, payload }: addReadWriteHeatMapActionT
): heatMapPayloadHashT {
  switch (type) {
    case DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS:
      if (!state[payload.page]) state = mergeState(state, payload);

      return state;
    case UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS:
      return mergeState(state, payload);

    default:
      return state;
  }
}
