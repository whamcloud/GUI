import _ from '@iml/lodash-mixins';
import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('Exception modal controller', () => {
  let $scope,
    createController,
    getMessage,
    plainError,
    responseError,
    stackTraceContainsLineNumber,
    sendStackTraceToRealTime,
    s,
    reverseStream,
    mockSocketStream,
    mod;

  beforeEach(() => {
    reverseStream = highland();

    mockSocketStream = jest.fn(() => reverseStream);

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    mod = require('../../../../source/iml/exception/exception-modal-controller.js');
  });

  beforeEach(
    angular.mock.inject(($rootScope, $controller) => {
      $scope = $rootScope.$new();

      plainError = new Error('Error');

      responseError = new Error('Response Error');

      responseError.response = {
        status: 500,
        headers: {},
        data: {
          error_message: '',
          traceback: ''
        },
        config: {
          method: 'POST',
          url: '/api/foo/bar/',
          headers: {},
          data: {}
        }
      };

      stackTraceContainsLineNumber = jest.fn(() => true);

      s = highland();
      sendStackTraceToRealTime = jest.fn(() => s);

      createController = deps => {
        deps = _.extend(
          {
            $scope: $scope,
            sendStackTraceToRealTime: sendStackTraceToRealTime,
            stackTraceContainsLineNumber: stackTraceContainsLineNumber
          },
          deps
        );

        $controller(mod.ExceptionModalCtrl, deps);
      };

      getMessage = name => {
        return $scope.exceptionModal.messages
          .filter(message => {
            return message.name === name;
          })
          .pop();
      };
    })
  );

  it('should convert a string cause to a message', () => {
    plainError.cause = 'fooz';

    createController({
      exception: plainError
    });

    expect(getMessage('cause')).toEqual({ name: 'cause', value: 'fooz' });
  });

  it('should return the expected messages for a plain error', () => {
    //Patch the stack as it becomes inconsistent as it's moved around.
    plainError.stack = 'ERROOR!';

    // Note this does not take IE into account as we (currently) do not run automated tests there.
    createController({ cause: null, exception: plainError });

    expect($scope.exceptionModal.messages).toEqual([
      { name: 'name', value: 'Error' },
      { name: 'message', value: 'Error' },
      { name: 'Client Stack Trace', value: 'ERROOR!' }
    ]);
  });

  it('should return the expected messages for a response error', () => {
    //Patch the stack as it becomes inconsistent as it's moved around.
    responseError.stack = 'ERROOR!';

    // Note this does not take IE into account as we (currently) do not run automated tests there.
    createController({ cause: null, exception: responseError });

    expect($scope.exceptionModal.messages).toEqual([
      { name: 'name', value: 'Error' },
      { name: 'message', value: 'Response Error' },
      { name: 'Client Stack Trace', value: 'ERROOR!' },
      { name: 'Response Status', value: 500 },
      { name: 'Response Headers', value: '{}' },
      { name: 'method', value: 'POST' },
      { name: 'url', value: '/api/foo/bar/' },
      { name: 'Request Headers', value: '{}' },
      { name: 'data', value: '{}' }
    ]);
  });

  it('should not throw when handling a plain error', () => {
    expect(() => {
      createController({ cause: null, exception: plainError });
    }).not.toThrow();
  });

  describe('handling non-strings when expecting multiline', () => {
    let create;

    beforeEach(() => {
      responseError.stack = 5;

      create = () => {
        createController({ cause: null, exception: responseError });
      };
    });

    it('should handle non-strings when expecting a multiline one', () => {
      expect(create).not.toThrow();
    });

    it('should print the string representation of the value', () => {
      create();

      expect(getMessage('Client Stack Trace')).toEqual({
        name: 'Client Stack Trace',
        value: '5'
      });
    });
  });

  describe('circular references', () => {
    beforeEach(() => {
      responseError.response.config.data.foo = responseError.response;
    });

    it('should not throw when handling a circular reference', () => {
      expect(() => {
        createController({ cause: null, exception: responseError });
      }).not.toThrow();
    });

    it('should return the string representation of the cyclic structure', () => {
      createController({ cause: null, exception: responseError });

      expect(getMessage('data')).toEqual({
        name: 'data',
        value: '[object Object]'
      });
    });
  });

  describe('stack trace format from server', () => {
    beforeEach(() => {
      plainError.statusCode = '400';

      createController({
        cause: 'fooz',
        exception: plainError
      });
    });

    it('should add the status code to the output', () => {
      expect(getMessage('Status Code')).toEqual({
        name: 'Status Code',
        value: '400'
      });
    });

    it('should not call sendStackTraceToRealTime', () => {
      expect(sendStackTraceToRealTime).not.toHaveBeenCalled();
    });

    it('should have a loadingStack value of undefined', () => {
      expect($scope.exceptionModal.loadingStack).toEqual(undefined);
    });
  });

  describe('stack trace format in production mode', () => {
    beforeEach(() => {
      createController({
        cause: 'fooz',
        exception: plainError
      });
    });

    describe('before resolving', () => {
      it('should call stackTraceContainsLineNumber', () => {
        expect(stackTraceContainsLineNumber).toHaveBeenCalled();
      });

      it('should call sendStackTraceToRealTime', () => {
        expect(sendStackTraceToRealTime).toHaveBeenCalled();
      });

      it('should have a loadingStack value of true', () => {
        expect($scope.exceptionModal.loadingStack).toEqual(true);
      });
    });

    describe('after de-uglifying', () => {
      const formattedStackTrace = 'formattedStackTrace';

      beforeEach(() => {
        s.write({ stack: formattedStackTrace });
        s.end();
      });

      it('should have a loadingStack value of false', () => {
        expect($scope.exceptionModal.loadingStack).toEqual(false);
      });

      it('should have the formatted stack trace', () => {
        expect(
          _.find($scope.exceptionModal.messages, {
            name: 'Client Stack Trace'
          }).value
        ).toEqual(formattedStackTrace);
      });
    });
  });

  describe('stack trace contains line number factory', () => {
    let stackTraceContainsLineNumberFactory;
    beforeEach(() => {
      stackTraceContainsLineNumberFactory = mod.stackTraceContainsLineNumbers;
    });

    [
      { stack: 'at some-file-location/file.js:85:13' },
      { stack: 'some-file-location/file.js:85:13)' },
      { stack: 'at some-file-location/file.js:85:13 ' },
      { stack: 'at some-file-location/file.js:85:13adsf' },
      { stack: 'some-file-location/file.js:85:13 more text' }
    ].forEach(stack => {
      describe('contains line number', () => {
        it(
          'should indicate that ' +
            stack.stack +
            ' contains line numbers and columns',
          () => {
            expect(stackTraceContainsLineNumberFactory(stack)).toEqual(true);
          }
        );
      });
    });

    [
      { stack: 'at some-file-location/file.js:85' },
      { stack: 'at some-file-location/file.js:85:' },
      { stack: 'at some-file-location/file.js:8513' }
    ].forEach(stack => {
      describe('does not contain line number', () => {
        it(
          'should indicate that ' +
            stack.stack +
            " doesn't contain both line and column numbers",
          () => {
            expect(stackTraceContainsLineNumberFactory(stack)).toEqual(false);
          }
        );
      });
    });
  });

  describe('send stack trace to real time factory', () => {
    let exception, sendStackTraceToRealTime, result;

    beforeEach(() => {
      sendStackTraceToRealTime = mod.sendStackTraceToRealTime;

      exception = {
        cause: 'cause',
        message: 'message',
        stack: 'stack',
        url: 'url'
      };

      result = sendStackTraceToRealTime(exception);
    });

    it('should send the request', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        '/srcmap-reverse',
        {
          method: 'post',
          cause: exception.cause,
          message: exception.message,
          stack: exception.stack,
          url: exception.url
        },
        true
      );
    });

    it('should return a stream', () => {
      expect(highland.isStream(result)).toBe(true);
    });

    [
      {
        message: 'should',
        response: {
          data: 'formatted exception'
        },
        expected: 'formatted exception'
      },
      {
        message: 'should not',
        response: {
          error: {
            stack: 'internal error'
          }
        },
        expected: 'stack'
      }
    ].forEach(data => {
      describe('and process response', () => {
        it(data.message + ' set the exception.stack to response.data', () => {
          reverseStream.write(data.response);
          reverseStream.end();

          result.each(updatedException => {
            expect(updatedException.stack).toEqual(data.expected);
          });
        });
      });
    });
  });
});
