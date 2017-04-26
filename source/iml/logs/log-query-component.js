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

import logInputToQsParser from './log-input-to-qs-parser.js';
import logQsToInputParser from './log-qs-to-input-parser.js';
import logCompleter from './log-completer.js';

import type { $scopeT, $locationT } from 'angular';

import type { qsStreamT } from '../qs-stream/qs-stream-module.js';

import type { PropagateChange } from '../extend-scope-module.js';

export function controller(
  $scope: $scopeT,
  $location: $locationT,
  $stateParams: Object,
  qsStream: qsStreamT,
  propagateChange: PropagateChange
) {
  'ngInject';
  const p = propagateChange.bind(null, $scope, this, 'qs');
  const qs$ = qsStream($stateParams);

  qs$.map(x => x.qs).through(p);

  $scope.$on('$destroy', () => qs$.destroy());

  Object.assign(this, {
    parserFormatter: {
      parser: logInputToQsParser,
      formatter: logQsToInputParser
    },
    completer: logCompleter,
    onSubmit: $location.search.bind($location)
  });
}

export default {
  controller,
  template: `
<div class="row">
  <div class="col-xs-12">
    <parsely-box
      on-submit="::$ctrl.onSubmit(qs)"
      query="$ctrl.qs"
      parser-formatter="::$ctrl.parserFormatter"
      completer="::$ctrl.completer(value, cursorPosition)"
    ></parsely-box>
  </div>
</div>
  `
};
