// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { StateServiceT } from "angular-ui-router";

import type { $scopeT } from "angular";

import type { qsStreamT } from "../qs-stream/qs-stream-module.js";

import type { PropagateChange } from "../extend-scope-module.js";

import type { HighlandStreamT } from "highland";

import type { LockT } from "../locks/locks-reducer.js";

export default function HsmFsCtrl(
  $scope: $scopeT,
  $state: StateServiceT,
  $stateParams: Object,
  qsStream: qsStreamT,
  fsStream: () => HighlandStreamT<any>,
  locksStream: HighlandStreamT<LockT>,
  propagateChange: PropagateChange
) {
  "ngInject";
  let fsStream2;

  const hsmFs = Object.assign(this, {
    onUpdate() {
      const fsId = hsmFs.selectedFs ? hsmFs.selectedFs.id : "";
      $state.go("app.hsmFs.hsm", {
        fsId,
        resetState: false
      });
    }
  });

  const p = propagateChange.bind(null, $scope, hsmFs);

  p("fileSystems", fsStream());
  p("locks", locksStream);

  const qs$ = qsStream($stateParams, {
    to: state => state.includes["app.hsmFs"]
  });

  qs$
    .tap(() => {
      if (fsStream2) {
        fsStream2.destroy();
        hsmFs.fs = fsStream2 = null;
      }
    })
    .each(() => {
      const fsId = parseInt($state.router.globals.params.fsId, 10);

      if (fsId) {
        fsStream2 = fsStream().map(xs => xs.find(x => x.id === fsId));
        p("fs", fsStream2);
      }
    });

  $scope.$on("$destroy", () => {
    qs$.destroy();
    fsStream.endBroadcast();
  });
}
