// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from '../global.js';

export function Controller () {
  'ngInject';

  var onMove = (ev:MouseEvent) => {
    this.rootPanel.onChange(ev.clientX);
  };

  this.onMouseDown = () => {
    this.rootPanel.setActive();
    global.document.addEventListener('mousemove', onMove);
    global.document.addEventListener('mouseup', onUp);
  };

  var onUp = () => {
    this.rootPanel.setInactive();
    global.document.removeEventListener('mousemove', onMove);
    global.document.removeEventListener('mouseup', onUp);
  };
}

export default {
  require: {
    rootPanel: '^rootPanel'
  },
  controller: Controller,
  template: `
    <div ng-mousedown="$ctrl.onMouseDown()">
      <div class="handle"></div>
    </div>
  `
};
