//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function throughRemoveEpochData(s) {
  return s.filter(function removeEpochData(x) {
    return new Date(x.ts).getTime();
  });
}
