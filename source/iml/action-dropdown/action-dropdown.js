// @flow

// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";

const initializeComponent = ({ record, locks, flag, tooltipPlacement, tooltipSize }, div) => {
  const { deferred_action_dropdown_component: actionDropdown } = global.wasm_bindgen;

  return actionDropdown(
    {
      record,
      locks,
      flag,
      tooltip_placement: tooltipPlacement,
      tooltip_size: tooltipSize
    },
    div
  );
};

export function ActionDropdownCtrl($element: HTMLElement[]) {
  "ngInject";

  const ctrl = this;

  const div = $element[0].querySelector("div");

  ctrl.seedApp = initializeComponent(ctrl, div);

  ctrl.$onChanges = changesObj => {
    if (ctrl.seedApp != null && changesObj.locks != null) ctrl.seedApp.set_locks(changesObj.locks.currentValue);
  };

  ctrl.$onDestroy = () => {
    if (ctrl.seedApp) {
      ctrl.seedApp.destroy();
      ctrl.seedApp.free();
    }
  };
}

export const actionDropdown = {
  bindings: {
    record: "<",
    locks: "<",
    flag: "@?",
    tooltipPlacement: "@?",
    tooltipSize: "@?"
  },
  controller: ActionDropdownCtrl,
  template: `<div></div>`
};
