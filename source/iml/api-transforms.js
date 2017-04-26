// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import * as fp from '@mfl/fp';

import type { HighlandStreamT } from 'highland';

export function addCurrentPage<T: { meta: Object }>(o: T): T {
  return {
    ...o,
    meta: {
      ...o.meta,
      current_page: o.meta.limit === 0 ? 1 : o.meta.offset / o.meta.limit + 1
    }
  };
}

type MapFn<A, B> = A => B;
export const rememberValue = function<A, B, C: HighlandStreamT<B> | B[]>(
  mapFn: MapFn<A, C>,
  in$: HighlandStreamT<A>
): HighlandStreamT<A> {
  let v;

  return in$.tap(x => (v = x)).flatMap(mapFn).map(() => v).otherwise(() => [v]);
};

export const matchById = (id: string) => fp.find(x => x.id === id);
