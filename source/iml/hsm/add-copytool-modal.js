//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from "../socket/socket-stream.js";

import { resolveStream } from "../promise-transforms.js";

export function AddCopytoolModalCtrl($scope, $uibModalInstance, workerStream, fsStream) {
  "ngInject";
  const addCopytoolModalCtrl = this;

  Object.assign(addCopytoolModalCtrl, {
    inProgress: false,
    filesystems: [],
    workers: [],
    copytool: {},
    onSubmit(copytool) {
      addCopytoolModalCtrl.inProgress = true;

      socketStream(
        "/copytool",
        {
          method: "post",
          json: copytool
        },
        true
      ).each($uibModalInstance.close.bind($uibModalInstance));
    }
  });

  let s = fsStream.pluck("objects");
  $scope.propagateChange($scope, addCopytoolModalCtrl, "filesystems", s);

  s = workerStream.pluck("objects");
  $scope.propagateChange($scope, addCopytoolModalCtrl, "workers", s);

  $scope.$on("$destroy", function onDestroy() {
    workerStream.destroy();
    fsStream.destroy();
  });
}

export function openAddCopytoolModalFactory($uibModal) {
  "ngInject";
  return function openAddCopytoolModal() {
    return $uibModal.open({
      template: `<div class="modal-header">
  <h4>Add Copytool</h4>
</div>
<div>
  <form novalidate name="form" role="form" ng-submit="addCopytool.onSubmit(addCopytool.copytool)">
    <div class="modal-body copytool">
      <div class="form-group tooltip-container"
           ng-class="{ 'has-error': form.filesystem.$invalid }"
      >
        <label for="filesystem" class="control-label">Filesystem</label>
        <span class="tooltip-container tooltip-hover">
          <a><i class="fa fa-question-circle"></i></a>
          <help-tooltip topic="add_copytool_filesystem" direction="right" size="'large'"></help-tooltip>
        </span>
        <select
          autofocus="true"
          class="form-control"
          name="filesystem"
          id="filesystem"
          ng-model="addCopytool.copytool.filesystem"
          ng-options="f.resource_uri as f.label for f in addCopytool.filesystems"
          required="true"
        >
          <option value="">{{ 'add_copytool_default_filesystem_option' | insertHelp }}</option>
        </select>

        <iml-tooltip class="error-tooltip" direction="bottom">
          Filesystem is required.
        </iml-tooltip>
      </div>

      <div class="form-group tooltip-container"
           ng-class="{'has-error': form.host.$invalid}"
      >
        <label for="host" class="control-label">Worker</label>
        <span class="tooltip-container tooltip-hover">
          <a><i class="fa fa-question-circle"></i></a>
          <help-tooltip topic="add_copytool_host" direction="right" size="'large'"></help-tooltip>
        </span>
        <select required="true"
                class="form-control"
                name="host"
                id="host"
                ng-model="addCopytool.copytool.host"
                ng-options="w.resource_uri as w.label for w in addCopytool.workers"
        >
          <option value="">{{ 'add_copytool_default_worker_option' | insertHelp }}</option>
        </select>
        <iml-tooltip class="error-tooltip" direction="bottom">
          Worker is required.
        </iml-tooltip>
      </div>

      <div class="form-group tooltip-container" ng-class="{'has-error': form.bin_path.$invalid}">
        <label for="bin_path" class="control-label">HSM Agent Binary Path</label>
        <span class="tooltip-container tooltip-hover">
          <a><i class="fa fa-question-circle"></i></a>
          <help-tooltip topic="add_copytool_bin_path" direction="right" size="'large'"></help-tooltip>
        </span>
        <input
          class="form-control"
          name="bin_path"
          id="bin_path"
          ng-model="addCopytool.copytool.bin_path"
          placeholder="Enter absolute HSM agent binary path"
          ng-pattern="/^\/.*[^/]$/"
          required="true"
        />
        <iml-tooltip class="error-tooltip" direction="bottom">
          <span>
            <span ng-if="form.bin_path.$error.required">HSM Agent Binary Path is required.</span>
            <span ng-if="form.bin_path.$error.pattern">Path must be absolute.</span>
          </span>
        </iml-tooltip>
      </div>

      <div class="form-group" ng-class="{'has-error': form.hsm_arguments.$invalid}">
        <label for="hsm_arguments" class="control-label">HSM Agent Arguments</label>
        <span class="tooltip-container tooltip-hover">
          <a><i class="fa fa-question-circle"></i></a>
          <help-tooltip topic="add_copytool_hsm_arguments" direction="right" size="'large'"></help-tooltip>
        </span>
        <input class="form-control"
               name="hsm_arguments"
               id="hsm_arguments"
               ng-model="addCopytool.copytool.hsm_arguments"
               placeholder="Enter HSM agent arguments"
                />
      </div>

      <div class="form-group tooltip-container" ng-class="{ 'has-error': form.mountpoint.$invalid }">
        <label for="mountpoint" class="control-label">Filesystem Mountpoint Path</label>
        <span class="tooltip-container tooltip-hover">
          <a><i class="fa fa-question-circle"></i></a>
          <help-tooltip topic="add_copytool_mountpoint" direction="right" size="'large'"></help-tooltip>
        </span>
        <input class="form-control"
               name="mountpoint"
               id="mountpoint"
               ng-model="addCopytool.copytool.mountpoint"
               placeholder="Enter absolute mountpoint path"
               ng-pattern="/^\/.+$/"
               required="true"
        />
        <iml-tooltip class="error-tooltip" direction="bottom">
          <span>
            <span ng-if="form.mountpoint.$error.required">Filesystem Mountpoint Path is required.</span>
            <span ng-if="form.mountpoint.$error.pattern">Path must be absolute.</span>
          </span>
        </iml-tooltip>
      </div>

      <div class="form-group tooltip-container" ng-class="{'has-error': form.archive.$invalid}">
        <label for="archive" class="control-label">Archive number</label>
        <span class="tooltip-container tooltip-hover">
          <a><i class="fa fa-question-circle"></i></a>
          <help-tooltip topic="add_copytool_archive" direction="top" size="'large'"></help-tooltip>
        </span>
        <div class="alert alert-warning" ng-if="addCopytool.copytool.archive === 0">
          <i class="fa fa-exclamation-triangle"></i>Warning: Archive 0 is reserved as the "catch-all" number, you probably don't want to use it.
        </div>
        <input class="form-control"
               name="archive"
               id="archive"
               type="number"
               ng-model="addCopytool.copytool.archive"
               min="0"
               required="true"
               placeholder="Enter archive number"
        />
        <iml-tooltip class="error-tooltip" direction="bottom">
          <span>
            <span ng-if="form.archive.$error.required">Archive number is required.</span>
            <span ng-if="form.archive.$error.pattern">Archive number must be an integer.</span>
            <span ng-if="form.archive.$error.number">Archive number must be an number.</span>
          </span>
        </iml-tooltip>
      </div>
    </div>
    <div class="modal-footer">
      <a ng-click="$dismiss()" class="btn btn-large btn-default">Cancel</a>
      <button type="submit" class="btn btn-large btn-success" ng-disabled="form.$invalid || addCopytool.inProgress">Save</button>
    </div>
  </form>
</div>`,
      controller: "AddCopytoolModalCtrl as addCopytool",
      backdrop: "static",
      windowClass: "add-copytool-modal",
      resolve: {
        fsStream() {
          "ngInject";
          return resolveStream(
            socketStream("/filesystem", {
              jsonMask: "objects(resource_uri,label)"
            })
          );
        },
        workerStream() {
          "ngInject";
          return resolveStream(
            socketStream("/host", {
              qs: { worker: true },
              jsonMask: "objects(resource_uri,label)"
            })
          );
        }
      }
    }).result;
  };
}
