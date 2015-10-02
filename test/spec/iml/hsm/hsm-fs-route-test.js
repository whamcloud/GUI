describe('hsm fs route', function () {

  var $routeSegmentProvider, GROUPS;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      when: jasmine.createSpy('$routeSegmentProvider.when'),
      segmentAuthenticated: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.within.andReturn($routeSegmentProvider);
    $routeSegmentProvider.when.andReturn($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'hsmFsRoute'));

  beforeEach(inject(function (_GROUPS_) {
    GROUPS = _GROUPS_;
  }));

  describe('when', function () {
    it('/configure/hsm/:fsId?', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/configure/hsm/:fsId?',
        'app.hsmFs.hsm');
    });
  });

  describe('within', function () {
    it('should specify "app"', function () {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
    });
  });

  describe('segmentAuthenticated', function () {
    it('should setup the hsm segment', function () {
      expect($routeSegmentProvider.segmentAuthenticated).toHaveBeenCalledOnceWith('hsmFs', {
        controller: 'HsmFsCtrl',
        controllerAs: 'hsmFs',
        templateUrl: 'iml/hsm/assets/html/hsm-fs.html',
        access: GROUPS.FS_ADMINS,
        resolve: {
          fsStream: ['fsCollStream', jasmine.any(Function)],
          copytoolStream: ['copytoolStream', jasmine.any(Function)]
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        }
      });
    });
  });
});
