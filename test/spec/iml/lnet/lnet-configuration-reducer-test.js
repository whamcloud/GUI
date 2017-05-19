import {
  ADD_LNET_CONFIGURATION_ITEMS
} from '../../../../source/iml/lnet/lnet-module.js';

import {
  default as lnetConfigurationReducer
} from '../../../../source/iml/lnet/lnet-configuration-reducer.js';
import deepFreeze from '@mfl/deep-freeze';

describe('lnet configuration reducer', () => {
  it('should be a function', () => {
    expect(lnetConfigurationReducer).toEqual(expect.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(
        lnetConfigurationReducer(deepFreeze([]), {
          type: ADD_LNET_CONFIGURATION_ITEMS,
          payload: [{}]
        })
      ).toEqual([{}]);
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(
        lnetConfigurationReducer(deepFreeze([]), {
          type: 'ADD_ALERT_INDICATOR_ITEMS',
          payload: { key: 'val' }
        })
      ).toEqual([]);
    });
  });
});
