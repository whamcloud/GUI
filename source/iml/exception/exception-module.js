// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import filtersModule from '../filters/filters-module.js';
import uiBootstrapModule from 'angular-ui-bootstrap';
import exceptionHandlerConfig from './exception-handler.js';
import exceptionInterceptorFactory from './exception-interceptor.js';
import exceptionModalFactory from './exception-modal.js';
import ExceptionModalCtrl from './exception-modal-controller.js';

export default angular
  .module('exceptionModule', [uiBootstrapModule, filtersModule])
  .config(exceptionHandlerConfig)
  .config($httpProvider => {
    'ngInject';
    $httpProvider.interceptors.push('exceptionInterceptor');
  })
  .factory('exceptionInterceptor', exceptionInterceptorFactory)
  .factory('exceptionModal', exceptionModalFactory)
  .controller('ExceptionModalCtrl', ExceptionModalCtrl).name;
