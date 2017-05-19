import highland from 'highland';

import targetDashboardModule
  from '../../../../source/iml/dashboard/target-dashboard-module';
import TargetDashboardController
  from '../../../../source/iml/dashboard/target-dashboard-controller';
import broadcaster from '../../../../source/iml/broadcaster.js';

describe('target dashboard', () => {
  beforeEach(module(targetDashboardModule));

  let $scope, ctrl, charts, targetStream, usageStream;

  beforeEach(
    inject(($controller, $rootScope) => {
      $scope = $rootScope.$new();

      charts = [
        {
          stream: {
            destroy: jasmine.createSpy('destroy')
          }
        }
      ];

      targetStream = highland();
      spyOn(targetStream, 'destroy');

      usageStream = highland();
      spyOn(usageStream, 'destroy');

      ctrl = $controller('TargetDashboardController', {
        $scope,
        charts,
        $stateParams: {
          kind: 'MDT'
        },
        targetStream,
        usageStream: broadcaster(usageStream)
      });
    })
  );

  it('should setup the controller', () => {
    const scope = window.extendWithConstructor(TargetDashboardController, {
      charts,
      usageStream: expect.any(Function),
      kind: 'MDT'
    });

    expect(ctrl).toEqual(scope);
  });

  it('should set data on the controller', () => {
    targetStream.write('foo');

    expect(ctrl.target).toEqual('foo');
  });

  describe('on destroy', () => {
    beforeEach(() => {
      $scope.$destroy();
    });

    it('should destroy the target stream', () => {
      expect(targetStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the usage stream', () => {
      expect(usageStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the charts', () => {
      expect(charts[0].stream.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
