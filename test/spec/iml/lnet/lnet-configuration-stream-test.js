import serverModule from '../../../../source/iml/lnet/lnet-module';
import highlandModule from '../../../../source/iml/highland/highland-module';
import highland from 'highland';

describe('server stream', () => {
  var lnetConfigurationStream, socketStream, s, spy;

  beforeEach(module(serverModule, highlandModule, $provide => {
    s = highland();
    spy = jasmine.createSpy('spy');
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(s);

    $provide.value('socketStream', socketStream);
  }));

  beforeEach(inject((_lnetConfigurationStream_) => {
    lnetConfigurationStream = _lnetConfigurationStream_;

    s.write({
      meta: 'meta',
      objects: [
        {
          id: 1
        }, {
          id: 2
        }
      ]
    });
  }));

  it('should invoke the socket stream', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/lnet_configuration', {
      qs: {
        dehydrate__host: false
      }
    });
  });

  it('should write the objects to the stream', () => {
    lnetConfigurationStream.each(spy);
    expect(spy).toHaveBeenCalledOnceWith([
      {
        id: 1
      }, {
        id: 2
      }
    ]);
  });
});
