// @flow

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

import angular from 'angular';
import * as fp from 'intel-fp';
import * as maybe from 'intel-maybe';

import getServerMoment from '../get-server-moment.js';
import createDate from '../create-date.js';

import type {
  HighlandStreamT
} from 'highland';

type statT = {
  data:{
    [key:string]:number
  },
  ts:string
};

export const getRequestRange = fp.curry3(function getRequestRangeOuter (overrides, begin, end) {
  getRequestRange.setLatest = fp.identity;

  return getRequestRange;

  function getRequestRange (params) {
    params = angular.merge({}, params, overrides);
    params.qs.begin = getServerMoment(begin).toISOString();
    params.qs.end = getServerMoment(end).toISOString();

    return params;
  }
});


export const getRequestDuration = fp.curry3(function getRequestDurationOuter (overrides:Object, size:number, unit:string) {
  var latest;

  getRequestDuration.setLatest = function setLatest (s:HighlandStreamT<statT>) {
    return s
      .collect()
      .tap((xs) => {
        const last = maybe.map(
          x => x.ts,
          fp.last(xs)
        );
        latest = maybe.withDefault(
          () => null,
          last
        );
      })
      .flatten();
  };

  return getRequestDuration;

  function getRequestDuration (params:Object) {
    params = angular.merge({}, params, overrides);

    if (latest) {
      var latestDate = createDate(latest);

      params.qs.end = latestDate.toISOString();
      params.qs.begin = createDate().toISOString();
      params.qs.update = true;
    } else {
      var end = getServerMoment()
        .milliseconds(0);

      var secs = end.seconds();
      end.seconds(secs - (secs % 10));

      params.qs.end = end
        .clone()
        .add(10, 'seconds')
        .toISOString();

      params.qs.begin = end
        .subtract(size, unit)
        .subtract(10, 'seconds')
        .toISOString();
    }

    return params;
  }
});

export const getTimeParams = {
  getRequestDuration,
  getRequestRange
};
