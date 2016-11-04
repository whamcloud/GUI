import moment from 'moment';
import highland from 'highland';
import * as fp from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('get time params', () => {
  let getServerMoment, createDate, getRequestRange,
    getRequestDuration, getTimeParams;

  beforeEachAsync(async function () {
    getServerMoment = jasmine.createSpy('getServerMoment');
    createDate = jasmine.createSpy('createDate');

    const mod = await mock('source/iml/charting/get-time-params.js', {
      'source/iml/get-server-moment.js': { default: getServerMoment },
      'source/iml/create-date.js': { default: createDate }
    });

    getRequestRange = mod.getRequestRange;
    getRequestDuration = mod.getRequestDuration;
    getTimeParams = mod.getTimeParams;
  });

  afterEach(resetAll);

  describe('getRequestRange', () => {
    beforeEach(() => {
      getServerMoment
        .and.callFake((d, f) => {
          // We always convert local time to utc time
          // implicitly before send.
          // For the purposes of these tests,
          // force to UTC right away
          // so they will run in different time zones.
          return moment.utc(d, f);
        });
    });

    it('should return a function', () => {
      expect(getRequestRange).toEqual(jasmine.any(Function));
    });

    describe('when invoked', () => {
      let requestRange;

      beforeEach(() => {
        requestRange = getRequestRange({
          qs: {
            id: '4'
          }
        }, '2015-04-30T00:00', '2015-05-01T00:00');
      });

      it('should return a function', () => {
        expect(requestRange)
          .toEqual(jasmine.any(Function));
      });

      it('should return a setLatest method', () => {
        expect(requestRange.setLatest)
          .toEqual(jasmine.any(Function));
      });

      it('should set the range on params', () => {
        const params = { qs: {} };

        expect(requestRange(params)).toEqual({
          qs: {
            id: '4',
            begin: '2015-04-30T00:00:00.000Z',
            end: '2015-05-01T00:00:00.000Z'
          }
        });
      });

      it('should clone the params', () => {
        const params = { qs: {} };

        expect(requestRange(params)).not.toBe(params);
      });
    });
  });

  describe('getRequestDuration', () => {
    beforeEach(() => {
      getServerMoment
        .and.callFake(() => {
          // We always convert local time to utc time
          // implicitly before send.
          // For the purposes of these tests,
          // force to UTC right away
          // so they will run in different time zones.
          return moment.utc('2015-04-30T00:00:00.000Z');
        });

      createDate
        .and.callFake(d => {
          if (!d)
            d = '2015-04-30T00:00:10.000Z';

          return new Date(d);
        });
    });

    it('should return a function', () => {
      expect(getRequestDuration).toEqual(jasmine.any(Function));
    });

    describe('invoking', () => {
      let requestDuration;

      beforeEach(() => {
        requestDuration = getRequestDuration({
          qs: {
            id: '3'
          }
        }, 10, 'minutes');
      });

      it('should return a function', () => {
        expect(requestDuration).toEqual(jasmine.any(Function));
      });

      it('should set begin and end params', () => {
        const params = { qs: {} };

        expect(requestDuration(params)).toEqual({
          qs: {
            id: '3',
            begin: '2015-04-29T23:49:50.000Z',
            end: '2015-04-30T00:00:10.000Z'
          }
        });
      });

      it('should clone the params', () => {
        const params = { qs: {} };

        expect(requestDuration(params)).not.toEqual(params);
      });

      it('should update when latest is set', () => {
        const params = { qs: {} };

        highland([{ ts: '2015-04-30T00:00:00.000Z' }])
          .through(requestDuration.setLatest)
          .each(fp.noop);

        expect(requestDuration(params)).toEqual({
          qs: {
            id: '3',
            begin: '2015-04-30T00:00:10.000Z',
            end: '2015-04-30T00:00:00.000Z',
            update: true
          }
        });
      });
    });
  });

  describe('getTimeParams', () => {
    it('should return time param functions', () => {
      expect(getTimeParams).toEqual({
        getRequestDuration: jasmine.any(Function),
        getRequestRange: jasmine.any(Function)
      });
    });
  });
});
