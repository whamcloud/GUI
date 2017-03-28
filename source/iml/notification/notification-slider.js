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

import * as fp from 'intel-fp';

import notificationSliderTemplate
  from './assets/html/notification-slider.html!text';

export function NotificationSliderController(
  $scope,
  $timeout,
  localApply,
  $exceptionHandler
) {
  'ngInject';
  let promise;

  const closeAfter5Seconds = $timeout.bind(
    null,
    () => $scope.open = false,
    5000
  );

  const objectLens = fp.lensProp('objects');

  this.stream
    .map(fp.view(fp.compose(objectLens, fp.mapped, fp.lensProp('message'))))
    .map(fp.view(objectLens))
    .filter(fp.view(fp.lensProp('length')))
    .stopOnError(fp.unary($exceptionHandler))
    .each(function(x) {
      if (x.length > 1) $scope.message = x.length + ' active alerts';
      else $scope.message = x[0];

      $scope.open = true;

      $timeout.cancel(promise);
      promise = closeAfter5Seconds();

      localApply($scope);
    });

  $scope.enter = function enter() {
    $timeout.cancel(promise);
  };

  $scope.leave = function leave() {
    promise = closeAfter5Seconds();
  };

  $scope.close = function close() {
    $timeout.cancel(promise);
    $scope.open = false;
  };
}

export function notificationSlider() {
  'ngInject';
  return {
    restrict: 'E',
    scope: {
      stream: '='
    },
    controllerAs: 'ctrl',
    bindToController: true,
    template: notificationSliderTemplate,
    controller: 'NotificationSliderController'
  };
}
