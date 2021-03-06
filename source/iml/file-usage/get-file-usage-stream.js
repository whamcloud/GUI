//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";

import socketStream from "../socket/socket-stream.js";
import removeDups from "../charting/remove-dups.js";
import toNvd3 from "../charting/to-nvd3.js";

export default keyName => (requestRange, buff) => {
  const s = highland((push, next) => {
    const params = requestRange({
      qs: {
        metrics: "filestotal,filesfree",
        reduce_fn: "average"
      }
    });

    socketStream("/target/metric", params, true)
      .flatten()
      .tap(function calculateCpuAndRam(x) {
        x.data[keyName] = (x.data.filestotal - x.data.filesfree) / x.data.filestotal;
      })
      .through(buff)
      .through(requestRange.setLatest)
      .through(removeDups)
      .through(toNvd3([keyName]))
      .each(function pushData(x) {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
};
