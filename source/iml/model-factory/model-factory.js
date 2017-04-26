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

export default function modelFactory() {
  let urlPrefix = '';

  return {
    setUrlPrefix: function(url) {
      urlPrefix = url;
    },
    $get: function($resource) {
      'ngInject';
      return function getModel({ url, params = {} }) {
        const conf = {
          url,
          actions: {
            get: { method: 'GET' },
            save: { method: 'POST' },
            update: { method: 'PUT' },
            delete: { method: 'DELETE' },
            patch: { method: 'PATCH' },
            query: {
              method: 'GET',
              isArray: true
            }
          },
          params: {
            ...params
          },
          subTypes: {}
        };

        if (conf.url === undefined)
          throw new Error('A url property must be provided to modelFactory!');

        Object.values(conf.actions).forEach(function(action) {
          action.interceptor = {
            response: function(resp) {
              if (!Resource.subTypes) return resp.resource;

              const boundAddSubTypes = addSubTypes.bind(
                null,
                Resource.subTypes
              );

              if (action.isArray) resp.resource.forEach(boundAddSubTypes);
              else boundAddSubTypes(resp.resource);

              return resp.resource;
            }
          };
        });

        const Resource = $resource(
          urlPrefix + conf.url,
          conf.params,
          conf.actions
        );

        return Resource;

        function addSubTypes(subTypes = {}, resource) {
          Object.entries(subTypes).forEach(([name, SubType]) => {
            if (!resource.hasOwnProperty(name)) return;

            resource[name] = new SubType(resource[name]);

            if (SubType.subTypes) addSubTypes(SubType.subTypes, resource[name]);
          });
        }
      };
    }
  };
}
