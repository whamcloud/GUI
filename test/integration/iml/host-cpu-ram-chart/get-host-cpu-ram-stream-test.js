import highland from 'highland';
import moment from 'moment';
import * as maybe from '@mfl/maybe';

import hostCpuRamDataFixtures
  from '../../../data-fixtures/host-cpu-ram-data-fixtures.json';

import { mock, resetAll } from '../../../system-mock.js';

describe('The host cpu ram stream', () => {
  let socketStream,
    serverStream,
    bufferDataNewerThan,
    getServerMoment,
    getHostCpuRamStream,
    getRequestDuration;

  beforeEachAsync(async function() {
    socketStream = jasmine
      .createSpy('socketStream')
      .and.callFake(() => (serverStream = highland()));

    getServerMoment = jasmine
      .createSpy('getServerMoment')
      .and.returnValue(moment('2013-11-18T20:59:30+00:00'));

    const bufferDataNewerThanModule = await mock(
      'source/iml/charting/buffer-data-newer-than.js',
      {
        'source/iml/get-server-moment.js': { default: getServerMoment }
      }
    );
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    const createDate = jasmine
      .createSpy('createDate')
      .and.callFake(arg =>
        maybe.withDefault(
          () => new Date(),
          maybe.map(x => new Date(x), maybe.of(arg))
        )
      );

    const getTimeParamsModule = await mock(
      'source/iml/charting/get-time-params.js',
      {
        'source/iml/create-date.js': { default: createDate }
      }
    );
    getRequestDuration = getTimeParamsModule.getRequestDuration;

    const mod = await mock(
      'source/iml/host-cpu-ram-chart/get-host-cpu-ram-stream.js',
      {
        'source/iml/socket/socket-stream.js': { default: socketStream }
      }
    );

    getHostCpuRamStream = mod.default;

    jasmine.clock().install();
  }, 10000);

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  let fixtures, spy;

  afterEach(resetAll);

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    fixtures = hostCpuRamDataFixtures;
  });

  it('should return a factory function', () => {
    expect(getHostCpuRamStream).toEqual(expect.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let hostCpuRamStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({}, 10, 'minutes');

      hostCpuRamStream = getHostCpuRamStream(requestDuration, buff);

      hostCpuRamStream.through(convertNvDates).each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
        jasmine.clock().tick(10000);
      });

      it('should return a stream', () => {
        expect(highland.isStream(hostCpuRamStream)).toBe(true);
      });

      it('should return computed data', () => {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should drop duplicate values', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();
        jasmine.clock().tick(10000);

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        serverStream.write([]);
        serverStream.end();
        jasmine.clock().tick(10000);
      });

      it('should return an empty nvd3 structure', () => {
        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'cpu',
            values: []
          },
          {
            key: 'ram',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();
        jasmine.clock().tick(10000);

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'cpu',
            values: [
              {
                x: '2013-11-18T20:59:30.000Z',
                y: 0.5233990147783252
              }
            ]
          },
          {
            key: 'ram',
            values: [
              {
                x: '2013-11-18T20:59:30.000Z',
                y: 0.39722490271763006
              }
            ]
          }
        ]);
      });
    });
  });
});
