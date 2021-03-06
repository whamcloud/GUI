//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from "@iml/lodash-mixins";
import highland from "highland";
import socketStream from "../socket/socket-stream.js";
import serversToApiObjects from "./servers-to-api-objects.js";
import { CACHE_INITIAL_DATA } from "../environment.js";

/**
 * Creates or updates hosts as needed.
 * @param {Object} servers
 * @returns {Highland.Stream}
 */
export default function createOrUpdateHostsStream(servers) {
  const objects = serversToApiObjects(servers);

  return socketStream(
    "/host",
    {
      qs: { limit: 0 }
    },
    true
  )
    .pluck("objects")
    .flatMap(function handleResponse(servers) {
      const findByAddress = _.findInCollection(["address"]);

      const toPost = objects
        .filter(
          _.compose(
            _.inverse,
            findByAddress(servers)
          )
        )
        .map(addDefaultProfile);

      const postHostStream = updateHostStream("post", toPost);

      const undeployedServers = _.where(servers, { state: "undeployed" });
      const toPut = _.difference(objects, toPost)
        .filter(findByAddress(undeployedServers))
        .map(addDefaultProfile);

      const putHostStream = updateHostStream("put", toPut);

      const leftovers = _.difference(objects, toPut, toPost);
      const unchangedServers = {
        objects: servers.filter(findByAddress(leftovers)).map(function buildResponse(server) {
          return {
            command_and_host: {
              command: false,
              host: server
            },
            error: null,
            traceback: null
          };
        })
      };

      return highland([postHostStream, putHostStream])
        .merge()
        .collect()
        .map(function combine(responses) {
          responses = responses.concat(unchangedServers).concat(function concatArrays(a, b) {
            return Array.isArray(a) ? a.concat(b) : undefined;
          });

          return _.merge.apply(_, responses);
        });
    });
}

/**
 * Add the default server profile
 * when "adding" a host.
 * @param {Object} server
 * @returns {Object}
 */
function addDefaultProfile(server) {
  const defaultProfileResourceUri = _.find(CACHE_INITIAL_DATA.server_profile, {
    name: "default"
  }).resource_uri;
  server.server_profile = defaultProfileResourceUri;
  return server;
}

/**
 * Creates or updates servers.
 * @param {String} method
 * @param {Object} data
 * @returns {Highland.Stream}
 */
function updateHostStream(method, data) {
  if (data.length === 0) return highland([{}]);

  return socketStream(
    "/host",
    {
      method: method,
      json: { objects: data }
    },
    true
  );
}
