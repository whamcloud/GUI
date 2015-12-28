import angular from 'angular';
const {module, inject} = angular.mock;
import λ from 'highland';
import {identity} from 'intel-fp/fp';

describe('hsm fs resolve', () => {
  var socketStream, s, resolveStream, fsCollStream,
    copytoolStream, addProperty, $q, $rootScope;

  beforeEach(module('hsmFs', ($provide) => {
    s = λ();
    socketStream = jasmine.createSpy('socketStream')
      .andReturn(s);
    $provide.value('socketStream', socketStream);

    resolveStream = jasmine.createSpy('resolveStream');
    $provide.value('resolveStream', resolveStream);

    addProperty = jasmine.createSpy('addProperty')
      .andCallFake(identity);

    $provide.value('addProperty', addProperty);
  }));

  beforeEach(inject((_hsmFsCollStream_, _hsmFsCopytoolStream_, _$q_, _$rootScope_) => {
    fsCollStream = _hsmFsCollStream_;
    copytoolStream = _hsmFsCopytoolStream_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    resolveStream.andReturn($q.when(s));
  }));

  describe('fsCollStream', () => {
    beforeEach(() => {
      fsCollStream();
      $rootScope.$digest();
    });

    it('should invoke socketStream with a call to filesystem', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
        jsonMask: 'objects(id,label,cdt_status,hsm_control_params,locks)'
      });
    });

    it('should resolve the stream', () => {
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });

    it('should send the stream through addProperty', () => {
      expect(addProperty).toHaveBeenCalledOnce();
    });
  });

  describe('copytoolStream', () => {
    beforeEach(() => {
      copytoolStream();
    });

    it('should invoke the socket stream', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/copytool', {
        jsonMask: 'objects(id)'
      });
    });

    it('should invoke resolveStream with the socket stream', () => {
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });
  });
});
