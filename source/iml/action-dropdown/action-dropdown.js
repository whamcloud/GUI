//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import getCommandStream from "../command/get-command-stream.js";
import groupActions from "./group-actions.js";
import { getWriteLocks } from "../locks/locks-utils.js";
import { type CompositeIdT, compositeIdsToQueryString } from "../api-utils.js";
import socketStream from "../socket/socket-stream.js";
import highland from "highland";

export function actionDescriptionCache($sce) {
  "ngInject";
  const cache = {};

  return function sceDescriptionCache(str) {
    return cache[str] || (cache[str] = $sce.trustAsHtml(str));
  };
}

const actionsTransformer = (actionsProperty, server) => s =>
  s.map(actions => ({
    ...server,
    [actionsProperty]: [...actions]
  }));

export function ActionDropdownCtrl(
  $scope,
  $exceptionHandler,
  handleAction,
  actionDescriptionCache,
  openCommandModal,
  localApply,
  propagateChange
) {
  "ngInject";
  const setConfirmOpen = isOpen => (this.confirmOpen = isOpen);

  const ctrl = Object.assign(this, {
    actionDescriptionCache,
    handleAction(record, action) {
      setConfirmOpen(true);

      const run = runHandleAction.bind(null, record, action);

      let stream;
      if (ctrl.overrideClick)
        stream = ctrl
          .overrideClick({
            record,
            action
          })
          .reject(fp.eq("fallback"))
          .otherwise(run);
      else stream = run();

      stream.pull(err => {
        if (err) $exceptionHandler(err);

        setConfirmOpen(false);

        localApply($scope);
      });
    },
    tooltipPlacement: this.tooltipPlacement || "left",
    actionsProperty: this.actionsProperty || "available_actions",
    receivedData: false,
    compositeIds: []
  });

  const p = propagateChange.bind(null, $scope, ctrl, "records");

  const asArray = fp.cond(
    [
      fp.flow(
        Array.isArray,
        fp.not
      ),
      fp.arrayWrap
    ],
    [fp.True, fp.identity]
  );

  highland(ctrl.stream)
    .map(asArray)
    .map(fp.filter(() => ctrl.locks != null))
    .tap(() => (ctrl.receivedData = true))
    .tap(xs => {
      ctrl.writeLocks = xs.reduce((prev, x) => prev + getWriteLocks(x.content_type_id, x.id, ctrl.locks).length, 0);
    })
    .flatMap(xs => {
      const streams = xs.map(x =>
        socketStream(
          `/action/?${compositeIdsToQueryString([{ contentTypeId: x.content_type_id, id: x.id }])}`,
          {},
          true
        )
          .pluck("objects")
          .through(actionsTransformer(ctrl.actionsProperty, x))
      );

      return highland(streams)
        .sequence()
        .collect();
    })
    .map(fp.map(item => ({ ...item, [ctrl.actionsProperty]: groupActions(item[ctrl.actionsProperty]) })))
    .through(p);

  function runHandleAction(record, action) {
    return handleAction(record, action)
      .filter(fp.identity)
      .flatMap(function openModal(x) {
        const stream = getCommandStream([x.command || x]);

        return openCommandModal(stream).resultStream.tap(stream.destroy.bind(stream));
      });
  }
}

export function actionDropdown() {
  "ngInject";
  return {
    restrict: "E",
    scope: {},
    bindToController: {
      tooltipPlacement: "@?",
      actionsProperty: "@?",
      stream: "<",
      locks: "<",
      overrideClick: "&?"
    },
    controller: "ActionDropdownCtrl",
    controllerAs: "ctrl",
    template: `<div class="action-dropdown">
      <button ng-if="ctrl.writeLocks || ctrl.confirmOpen" disabled class="btn btn-primary btn-sm">Disabled</button>
      <button ng-if="ctrl.receivedData && ctrl.records.length === 0" disabled class="btn btn-primary btn-sm">No Actions</button>
      <div ng-if="!ctrl.writeLocks && !ctrl.confirmOpen" class="btn-group" uib-dropdown>
        <button ng-if="!ctrl.receivedData || ctrl.records.length > 0" class="btn btn-primary btn-sm" uib-dropdown-toggle>
          Actions<i class="fa fa-caret-down"></i>
        </button>
        <ul uib-dropdown-menu class="uib-dropdown-menu" role="menu">
          <li class="dropdown-header" ng-repeat-start="record in ctrl.records track by record.label">
            {{ ::record.label }}
          </li>
          <li class="tooltip-container tooltip-hover" ng-class="{ 'end-of-group': action.last }" ng-repeat="action in record[ctrl.actionsProperty] track by action.verb">
            <a ng-click="::ctrl.handleAction(record, action)">
               {{ ::action.verb }}
            </a>
            <iml-tooltip size="'large'" direction="{{::ctrl.tooltipPlacement}}">
              <p ng-bind-html="ctrl.actionDescriptionCache(action.long_description)"></p>
            </iml-tooltip>
          </li>
          <li ng-repeat-end class="divider"></li>
        </ul>
      </div>
    </div>`
  };
}
