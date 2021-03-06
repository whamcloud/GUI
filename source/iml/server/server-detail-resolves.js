// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import socketStream from "../socket/socket-stream.js";
import getNetworkInterfaceStream from "../lnet/get-network-interface-stream.js";
import angular from "angular";
import highland from "highland";
import * as fp from "@iml/fp";
import broadcaster from "../broadcaster.js";

import { matchById } from "../api-transforms.js";

import { streamToPromise } from "../promise-transforms.js";

import { resolveStream } from "../promise-transforms.js";

export const getData = ($stateParams: { id: string }) => {
  "ngInject";
  return streamToPromise(
    store
      .select("server")
      .map(Object.values)
      .map(matchById($stateParams.id))
  );
};

export default function serverDetailResolves($stateParams: { id: string }) {
  "ngInject";
  const getObjectsOrNull = x => (x.objects.length ? x.objects : null);
  const getFlatObjOrNull = fp.flow(
    highland.map(getObjectsOrNull),
    x => x.flatten()
  );

  const locksStream = broadcaster(store.select("locks"));

  const alertMonitorStream = broadcaster(store.select("alertIndicators").map(Object.values));

  const serverStream = store
    .select("server")
    .map(Object.values)
    .map(xs => xs.find(x => x.id === Number.parseInt($stateParams.id)));

  const allHostMatches = {
    qs: {
      host__id: $stateParams.id,
      limit: 0
    }
  };

  const lnetConfigurationStream = broadcaster(
    store
      .select("lnetConfiguration")
      .map(Object.values)
      .map(xs => xs.find(x => x.host_id === Number.parseInt($stateParams.id)))
      .map(x => x.set("label", "LNet Configuration"))
      .map(x => x.set("resource_uri", `/api/lnet_configuration/${x.id}/`))
  );

  const merge = (a, b) => angular.merge(a, b, allHostMatches);

  const networkInterfaceStream = resolveStream(
    getNetworkInterfaceStream(
      merge(
        {},
        {
          jsonMask: "objects(id,inet4_address,name,nid,lnd_types,resource_uri)"
        }
      )
    )
  );

  const cs = socketStream(
    "/corosync_configuration",
    merge(
      {},
      {
        jsonMask: "objects(resource_uri,available_actions,mcast_port,state,content_type_id,id,network_interfaces,label)"
      }
    )
  );

  const cs2 = cs.through(getFlatObjOrNull);

  const corosyncConfigurationStream = resolveStream(cs2).then(broadcaster);

  const ps = socketStream(
    "/pacemaker_configuration",
    merge(
      {},
      {
        jsonMask: "objects(resource_uri,available_actions,state,content_type_id,id,label)"
      }
    )
  );

  const ps2 = ps.through(getFlatObjOrNull);

  const pacemakerConfigurationStream = resolveStream(ps2).then(broadcaster);

  return Promise.all([
    locksStream,
    alertMonitorStream,
    serverStream,
    lnetConfigurationStream,
    networkInterfaceStream,
    corosyncConfigurationStream,
    pacemakerConfigurationStream
  ]).then(
    ([
      locksStream,
      alertMonitorStream,
      serverStream,
      lnetConfigurationStream,
      networkInterfaceStream,
      corosyncConfigurationStream,
      pacemakerConfigurationStream
    ]) => ({
      locksStream,
      alertMonitorStream,
      serverStream,
      lnetConfigurationStream,
      networkInterfaceStream,
      corosyncConfigurationStream,
      pacemakerConfigurationStream
    })
  );
}
