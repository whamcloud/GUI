// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import { data$Fn, getConf } from "./chart-transformers.js";

import type { HighlandStreamT } from "highland";

import type { durationPayloadT } from "../duration-picker/duration-picker-module.js";

import type { heatMapDurationPayloadT } from "../read-write-heat-map/read-write-heat-map-module.js";

import type { ostBalancePayloadT } from "../ost-balance/ost-balance-module.js";

import type { filesystemQueryT, targetQueryT } from "../dashboard/dashboard-module.js";

type confTypes = durationPayloadT | heatMapDurationPayloadT | ostBalancePayloadT;

export type configToStreamT = (x: durationPayloadT) => (a: any, b: any) => HighlandStreamT<any>;

export type getConfT = (page: string) => HighlandStreamT<confTypes>;

export type data$FnT = (filesystemQueryT | targetQueryT, configToStreamT, mixed) => HighlandStreamT<mixed>;

export default angular
  .module("chartTransformers", [])
  .factory("data$Fn", data$Fn)
  .value("getConf", getConf).name;
