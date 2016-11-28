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

import store from './store/get-store.js';
import {
  streamToPromise
} from './promise-transforms.js';

import {
  groupAllowed
} from './auth/authorization.js';

import type {
  TransitionServiceT,
  StateDeclarationT,
  StateServiceT
} from 'angular-ui-router';

export type routeStateT = StateDeclarationT & {
  data?:{
    parent?:string,
    anonymousReadProtected?:boolean,
    eulaState?:boolean,
    helpPage?:string,
    label?:string,
    parentName?:string,
    access?:string
  }
};

export default function routeTransitions ($transitions:TransitionServiceT, $state:StateServiceT) {
  'ngInject';

  const allowAnonymousReadPredicate = {
    to: state => {
      return state.data && state.data.anonymousReadProtected === true;
    }
  };

  const processAllowAnonymousRead = () =>
    streamToPromise(
      store
        .select('session')
    )
    .then(({session}) => {
      if (!session.read_enabled)
        return $state.target('login');
    });

  const eulaStatePredicate = {
    to: state => {
      return state.data && state.data.eulaState === true;
    }
  };

  const processEulaState = () =>
    streamToPromise(
      store
        .select('session')
    )
    .then(({session}) => {
      if (session.user && session.user.eula_state !== 'pass')
        return $state.target('login');
    });

  const authenticationPredicate = {
    to: state => {
      return state.data && state.data.access != null;
    }
  };

  const processAuthentication = transition => {
    const authenticated = groupAllowed(transition.to().data.access);

    if (!authenticated)
      return $state.target(
        'app',
        undefined,
        {
          location: true
        }
      );
  };

  $transitions.onStart(allowAnonymousReadPredicate, processAllowAnonymousRead);
  $transitions.onStart(eulaStatePredicate, processEulaState);
  $transitions.onStart(authenticationPredicate, processAuthentication);
}
