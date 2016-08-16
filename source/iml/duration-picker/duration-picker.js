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

export const DURATIONS = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks'
};

// $FlowIgnore: HTML templates that flow does not recognize.
import durationPickerTemplate from './assets/html/duration-picker.html!text';

export default {
  scope: {},
  template: durationPickerTemplate,
  bindings: {
    type: '<',
    size: '<',
    unit: '<',
    startDate: '<',
    endDate: '<'
  },
  controller () {
    'ngInject';

    Object.assign(
        this,
      {
        units: [
          { unit: DURATIONS.MINUTES, count: 60 },
          { unit: DURATIONS.HOURS, count: 24 },
          { unit: DURATIONS.DAYS, count: 31 },
          { unit: DURATIONS.WEEKS, count: 4 }
        ],
        getCount (unit) {
          var item = this.units
            .filter(item => item.unit === unit)
            .pop();

          if (item) return item.count;
        },
        setUnit (unit) {
          this.unit = unit;
          this.size = 1;
        }
      });
  }
};
