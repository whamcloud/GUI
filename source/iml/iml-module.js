// @flow

// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import "../styles/imports.less";
import "../favicon.ico";

import "./target/target-dispatch-source.js";
import "./lnet/lnet-dispatch-source.js";
import "./server/server-dispatch-source.js";
import "./file-system/file-system-dispatch-source.js";
import "./user/user-dispatch-source.js";
import "./session/session-dispatch-source.js";
import "./storage/storage-dispatch-source.js";
import "./sse/sse-handler.js";
import "./listeners.js";
import "./action-dropdown/action-dropdown-handlers.js";
import "./command/command-handlers.js";

import * as ENV from "./environment.js";
import angular from "angular";
import { render } from "inferno";
import uiBootstrapModule from "angular-ui-bootstrap";
import uiRouter from "angular-ui-router";
import ngAnimate from "angular-animate";
import exceptionModule from "./exception/exception-module";
import routeToModule from "./route-to/route-to-module";
import loginModule from "./login/login-module";
import appModule from "./app/app-module";
import dashboardModule from "./dashboard/dashboard-module";
import baseDashboardModule from "./dashboard/base-dashboard-module";
import serverDashboardModule from "./dashboard/server-dashboard-module";
import targetDashboardModule from "./dashboard/target-dashboard-module";
import serverModule from "./server/server-module";
import jobStatsModule from "./job-stats/job-stats-module";
import hsmFsModule from "./hsm/hsm-fs-module";
import hsmModule from "./hsm/hsm-module";
import aboutComponent from "./about/about-component.js";
import statusModule from "./status/status-module";
import mgtModule from "./mgt/mgt-module";
import logModule from "./logs/log-module.js";
import treeModule from "./tree/tree-module.js";
import fileSystemModule from "./file-system/file-system-module.js";
import qsStreamModule from "./qs-stream/qs-stream-module.js";
import multiTogglerModule from "./multi-toggler/multi-toggler-module.js";
import chartTransformersModule from "./chart-transformers/chart-transformers-module.js";
import resettableGroupModule from "./resettable-group/resettable-group-module.js";
import oldRouteModule from "./old-gui-shim/old-route-module.js";
import asViewerDirective from "./as-viewer/as-viewer.js";
import sliderPanelComponent from "./panels/slider-panel-component.js";
import sidePanelComponent from "./panels/side-panel-component.js";
import rootPanelComponent from "./panels/root-panel-component.js";
import toggleSidePanelComponent from "./panels/toggle-side-panel-component.js";
import routeTransitions from "./route-transitions.js";
import breadcrumbComponent from "./breadcrumb/breadcrumb.js";
import pageTitleComponent from "./page-title/page-title-component.js";
import uiLoaderViewDirective from "./ui-loader-view-directive.js";
import storageComponent from "./storage/storage-component.js";
import storageDetailComponent from "./storage/storage-detail-component.js";
import addStorageComponent from "./storage/add-storage-component.js";
import { tzPickerComponent } from "./tz-picker/tz-picker.js";
import { displayDateComponent } from "./display-date";

import { loginState } from "./login/login-states.js";

import { appState } from "./app/app-states.js";

import { mgtState } from "./mgt/mgt-states.js";

import { statusState, queryState, tableState } from "./status/status-states.js";

import { aboutState } from "./about/about-states.js";

import { serverState, serverDetailState } from "./server/server-states.js";

import { fileSystemListState, fileSystemDetailState } from "./file-system/file-system-states.js";

import { logState, logTableState } from "./logs/log-states.js";

import { hsmFsState, hsmState } from "./hsm/hsm-states.js";

import { jobStatsState } from "./job-stats/job-stats-states.js";

import { storageState, addStorageState, storageDetailState } from "./storage/storage-states.js";

import {
  dashboardState,
  dashboardOverviewState,
  dashboardServerState,
  dashboardOstState,
  dashboardMdtState,
  dashboardFsState
} from "./dashboard/dashboard-states.js";

import oldGUIStates from "./old-gui-shim/old-gui-states.js";

import { getHostProfilesFactory, createHostProfilesFactory } from "./server/create-host-profiles-stream";

import { imlTooltip } from "./tooltip/tooltip.js";
import imlPopover from "./iml-popover.js";
import Position from "./position.js";
import { alertIndicatorNg } from "./alert-indicator/alert-indicator.js";
import jobStatus from "./job-indicator/job-indicator.js";
import pdsh from "./pdsh/pdsh.js";
import help from "./help.js";
import windowUnload from "./window-unload.js";
import getStore from "./store/get-store";
import { querySelector } from "./dom-utils";
import global from "./global.js";
import DisconnectModal from "./disconnect-modal/disconnect-modal.js";

import { type DisconnectModalStateT } from "./disconnect-modal/disconnect-modal-reducer.js";

const imlModule = angular
  .module("iml", [
    uiBootstrapModule,
    ngAnimate,
    routeToModule,
    exceptionModule,
    uiRouter,
    loginModule,
    qsStreamModule,
    appModule,
    dashboardModule,
    baseDashboardModule,
    serverDashboardModule,
    targetDashboardModule,
    serverModule,
    jobStatsModule,
    hsmFsModule,
    hsmModule,
    multiTogglerModule,
    statusModule,
    mgtModule,
    logModule,
    treeModule,
    fileSystemModule,
    chartTransformersModule,
    resettableGroupModule,
    oldRouteModule
  ])
  .config($compileProvider => {
    "ngInject";
    $compileProvider.debugInfoEnabled(false);
  })
  .config($locationProvider => {
    "ngInject";
    $locationProvider.html5Mode(true).hashPrefix("!");
  })
  .config($animateProvider => {
    "ngInject";
    $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);
  })
  .config($urlMatcherFactoryProvider => {
    "ngInject";
    $urlMatcherFactoryProvider.strictMode(false);
  })
  .config($stateProvider => {
    "ngInject";
    $stateProvider
      .state(loginState)
      .state(appState)
      .state(mgtState)
      .state(statusState)
      .state(tableState)
      .state(queryState)
      .state(aboutState)
      .state(serverState)
      .state(serverDetailState)
      .state(logTableState)
      .state(logState)
      .state(hsmFsState)
      .state(hsmState)
      .state(dashboardState)
      .state(dashboardOverviewState)
      .state(dashboardServerState)
      .state(dashboardOstState)
      .state(dashboardMdtState)
      .state(dashboardFsState)
      .state(jobStatsState)
      .state(storageState)
      .state(addStorageState)
      .state(storageDetailState);

    oldGUIStates.forEach(s => $stateProvider.state(s));

    $stateProvider.state(fileSystemListState).state(fileSystemDetailState);
  })
  .directive("asViewer", asViewerDirective)
  .component("aboutComponent", aboutComponent)
  .component("sliderPanel", sliderPanelComponent)
  .component("sidePanel", sidePanelComponent)
  .component("rootPanel", rootPanelComponent)
  .component("toggleSidePanel", toggleSidePanelComponent)
  .component("breadcrumb", breadcrumbComponent)
  .component("pageTitle", pageTitleComponent)
  .directive("uiLoaderView", uiLoaderViewDirective)
  .directive("imlTooltip", imlTooltip)
  .component("jobStatus", jobStatus)
  .service("position", Position)
  .directive("imlPopover", imlPopover)
  .factory("getHostProfiles", getHostProfilesFactory)
  .factory("createHostProfiles", createHostProfilesFactory)
  .factory("help", help)
  .factory("windowUnload", windowUnload)
  .component("recordState", alertIndicatorNg)
  .directive("pdsh", pdsh)
  .component("storage", storageComponent)
  .component("addStorage", addStorageComponent)
  .component("storageDetail", storageDetailComponent)
  .component("tzPicker", tzPickerComponent)
  .component("displayDate", displayDateComponent)
  .constant("STATE_SIZE", {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large"
  })
  .value("ENV", ENV)
  .run(routeTransitions);

Object.keys(ENV).forEach(key => imlModule.value(key, ENV[key]));

angular.bootstrap(document, ["iml"], {});

const disconnectModalContainer = document.createElement("div");
const body = querySelector(global.document, "body");
getStore.select("disconnectModal").each(({ realtimeDisconnected, sseDisconnected }: DisconnectModalStateT) => {
  const containerOnBody = body.contains(disconnectModalContainer);

  if (realtimeDisconnected === false && sseDisconnected === false && containerOnBody) {
    render(null, disconnectModalContainer);
    body.removeChild(disconnectModalContainer);
  } else if ((realtimeDisconnected === true || sseDisconnected === true) && containerOnBody === false) {
    body.appendChild(disconnectModalContainer);
    render(<DisconnectModal />, disconnectModalContainer);
  }
});
