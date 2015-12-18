describe('Server dashboard controller', function () {
  'use strict';

  beforeEach(window.module('serverDashboard'));

  var $scope, ctrl, hostStream, charts;

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    charts = [];

    hostStream = highland();
    spyOn(hostStream, 'destroy');

    ctrl = $controller('ServerDashboardCtrl', {
      $scope: $scope,
      hostStream: hostStream,
      charts: charts
    });
  }));

  it('should add charts to the controller', function () {
    expect(ctrl.charts).toBe(charts);
  });

  it('should set host data on the controller', function () {
    hostStream.write('foo');

    expect(ctrl.server).toEqual('foo');
  });

  it('should destroy the host stream', function () {
    $scope.$destroy();

    expect(hostStream.destroy).toHaveBeenCalledOnce();
  });
});
