import highland from 'highland';
import pacemakerModule from '../../../../source/iml/pacemaker/pacemaker-module';

describe('pacemaker state directive', () => {
  beforeEach(module(pacemakerModule));

  let el, $scope;

  beforeEach(
    inject(($rootScope, $compile) => {
      const template = '<pacemaker-state stream="stream"></pacemaker-state>';

      $scope = $rootScope.$new();
      $scope.stream = highland();
      spyOn($scope.stream, 'destroy');

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  const states = [
    ['Pacemaker Started', 'started'],
    ['Pacemaker Stopped', 'stopped'],
    ['Pacemaker Unconfigured', 'unconfigured']
  ];

  states.forEach(state => {
    it(`should display state for ${state[0]} with no host id`, () => {
      $scope.stream.write({
        state: state[1]
      });

      expect(el.querySelector('span').textContent.trim()).toEqual(state[0]);
    });
  });

  it('should display nothing when there is no data', () => {
    $scope.stream.write();

    expect(el.querySelector('span')).toBeNull();
  });

  it('should display nothing when there is bad data', () => {
    $scope.stream.write(null);

    expect(el.querySelector('span')).toBeNull();
  });

  it('should destroy the stream when the scope is destroyed', () => {
    $scope.$destroy();

    expect($scope.stream.destroy).toHaveBeenCalledOnce();
  });
});
