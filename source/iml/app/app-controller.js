//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

export default function AppCtrl(
  $scope,
  session,
  navigate,
  ENV,
  GROUPS,
  help,
  notificationStream,
  alertStream
) {
  'ngInject';
  const login = navigate.bind(null, 'login/');

  angular.extend(this, {
    RUNTIME_VERSION: ENV.RUNTIME_VERSION,
    COPYRIGHT_YEAR: help.get('copyright_year'),
    GROUPS,
    session,
    status: {},
    user: session.user,
    loggedIn: loggedIn(),
    onClick: loggedIn() ? logout : login,
    isCollapsed: true,
    login,
    logout,
    alertStream
  });

  function loggedIn() {
    return session.user && session.user.id != null;
  }

  function logout() {
    return session.$delete().then(login);
  }

  const LIMIT = 99;

  const ctrl = this;

  const p = $scope.propagateChange($scope, this, 'status');

  notificationStream
    .tap(function computeProperties(status) {
      status.aboveLimit = status.count > LIMIT;

      status.count = status.aboveLimit ? LIMIT : status.count;

      ctrl.link = '/ui/status/';

      if (status.health !== 'GOOD')
        ctrl.link += '?severity__in=WARNING,ERROR&active=true';
    })
    .through(p);

  $scope.$on('$destroy', () => {
    alertStream.destroy();
    notificationStream.destroy();
  });
}
