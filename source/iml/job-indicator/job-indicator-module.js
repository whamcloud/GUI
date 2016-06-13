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
import uiBootstrapModule from 'angular-ui-bootstrap';
import highlandModule from '../highland/highland-module.js';
import socketModule from '../socket/socket-module.js';
import popoverModule from '../popover/popover-module.js';
import tooltipModule from '../tooltip/tooltip-module.js';
import extendScopeModule from '../extend-scope-module.js';
import jobIndicatorReducer from './job-indicator-reducer.js';
import jobIndicatorStream from './job-indicator-stream.js';
import jobStatusDirective from './job-indicator.js';
import jobIndicatorDispatchSource from './job-indicator-dispatch-source.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import jobIndicatorTemplate from './assets/html/job-indicator';

export const ADD_JOB_INDICATOR_ITEMS = 'ADD_JOB_INDICATOR_ITEMS';

export default angular.module('jobIndicator', [
  socketModule, popoverModule, uiBootstrapModule,
  tooltipModule, extendScopeModule,
  jobIndicatorTemplate, highlandModule
])
.directive('jobStatus', jobStatusDirective)
.value('jobIndicatorReducer', jobIndicatorReducer)
.factory('jobIndicatorStream', jobIndicatorStream)
.factory('jobIndicatorDispatchSource', jobIndicatorDispatchSource)
.name;
