// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import * as maybe from "@iml/maybe";

const getHostByFqdn = (hosts, fqdn) => maybe.map(x => x.id, fp.find(x => x.fqdn === fqdn)(hosts));

type objArr = [Object[], Object];

export function addHostIds([servers, logs]: objArr) {
  logs.objects = logs.objects.map(log => {
    const hostId = maybe.withDefault(() => {}, getHostByFqdn(servers, log.fqdn));

    return {
      ...log,
      host_id: hostId
    };
  });

  return logs;
}
