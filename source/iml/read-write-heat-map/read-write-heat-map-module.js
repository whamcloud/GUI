//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

// @flow

import angular from 'angular';
import chartsModule from '../charts/charts-module';
import chartingModule from '../charting/charting-module';
import highlandModule from '../highland/highland-module';
import durationPickerModule from '../duration-picker/duration-picker-module';
import getReadWriteHeatMapChartFactory from './get-read-write-heat-map-chart';

export type readWriteHeatMapTypesT = {
  READ_BYTES: 'stats_read_bytes',
  WRITE_BYTES: 'stats_write_bytes',
  READ_IOPS: 'stats_read_iops',
  WRITE_IOPS: 'stats_write_iops'
};

export type rangeConfigT = {
  configType: 'range',
  startDate: string,
  endDate: string,
  dataType: string,
  page: string
};

export type durationConfigT = {
  configType: 'duration',
  size: number,
  unit: string,
  dataType: string,
  page: string
};

import type {
  scopeToElementT
} from '../chart-compiler/chart-compiler-module.js';


export type heatMapConfigT = rangeConfigT | durationConfigT;
export type heatMapDurationPayloadT = rangeConfigT & durationConfigT;
export type getReadWriteHeatMapChartT = (overrides:Object) => Promise<scopeToElementT>;

export type heatMapPayloadHashT = {
  [page:string]:heatMapDurationPayloadT
};

export type addReadWriteHeatMapActionT = {
    type: 'DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS' | 'UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS',
    payload: heatMapDurationPayloadT
};

export default angular.module('readWriteHeatMap', [
  chartsModule, chartingModule, highlandModule,
  durationPickerModule
])
  .constant('readWriteHeatMapTypes', {
    READ_BYTES: 'stats_read_bytes',
    WRITE_BYTES: 'stats_write_bytes',
    READ_IOPS: 'stats_read_iops',
    WRITE_IOPS: 'stats_write_iops'
  })
  .factory('getReadWriteHeatMapChart', getReadWriteHeatMapChartFactory)
  .name;
