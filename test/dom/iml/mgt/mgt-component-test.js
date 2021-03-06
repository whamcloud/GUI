import highland from "highland";
import broadcaster from "../../../../source/iml/broadcaster.js";
import mgtComponent from "../../../../source/iml/mgt/mgt-component.js";
import { alertIndicatorNg } from "../../../../source/iml/alert-indicator/alert-indicator.js";
import jobStatus from "../../../../source/iml/job-indicator/job-indicator.js";
import asValue from "../../../../source/iml/as-value/as-value.js";
import asStream from "../../../../source/iml/as-stream/as-stream.js";
import extractApiFilter from "../../../../source/iml/extract-api-filter/extract-api-filter.js";
import { imlTooltip } from "../../../../source/iml/tooltip/tooltip.js";
import imlPopover from "../../../../source/iml/iml-popover.js";
import position from "../../../../source/iml/position.js";
import routeTo from "../../../../source/iml/route-to/route-to.js";
import angular from "../../../angular-mock-setup.js";
import uiBootstrap from "angular-ui-bootstrap";

describe("mgt component", () => {
  let mockGetCommandStream, mockSocketStream, mockGlobal;

  beforeEach(() => {
    if (!window.angular) require("angular");
  });

  beforeEach(
    angular.mock.module(
      { UI_ROOT: "/root/of/app/" },
      uiBootstrap,
      ($provide, $compileProvider, $controllerProvider, $filterProvider) => {
        mockGetCommandStream = jest.fn(() => highland());
        jest.mock("../../../../source/iml/command/get-command-stream.js", () => mockGetCommandStream);

        mockSocketStream = jest.fn(() => highland());
        jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

        mockGlobal = {
          crypto: {
            getRandomValues: jest.fn(() => [12345])
          },
          wasm_bindgen: {
            deferred_action_dropdown_component: jest.fn()
          }
        };
        jest.mock("../../../../source/iml/global.js", () => mockGlobal);

        const { actionDropdown } = require("../../../../source/iml/action-dropdown/action-dropdown.js");

        $provide.value("socketStream", jest.fn());
        $compileProvider.component("mgt", mgtComponent);
        $compileProvider.component("recordState", alertIndicatorNg);
        $compileProvider.component("jobStatus", jobStatus);

        $compileProvider.component("actionDropdown", actionDropdown);
        $compileProvider.directive("asValue", asValue);
        $compileProvider.directive("asStream", asStream);
        $filterProvider.register("extractApi", extractApiFilter);
        $provide.value("STATE_SIZE", {
          SMALL: "small",
          MEDIUM: "medium",
          LARGE: "large"
        });

        $compileProvider.directive("imlTooltip", imlTooltip);
        $compileProvider.directive("imlPopover", imlPopover);
        $provide.service("position", position);
        $compileProvider.directive("routeTo", routeTo);
      }
    )
  );

  let el, $scope;
  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const template = ` <mgt mgt-$="mgtStream" alert-indicator-b="mgtAlertIndicatorStream" locks-$="locksStream"></mgt> `;

      $scope = $rootScope.$new();
      $scope.mgtStream = highland();

      const s = highland();
      s.write([]);
      $scope.mgtAlertIndicatorStream = broadcaster(s);
      $scope.locksStream = highland([{}]);
      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  describe("with data", () => {
    beforeEach(() => {
      $scope.mgtStream.write([
        {
          content_type_id: 89,
          id: 1,
          label: "MGS_49c000",
          resource_uri: "/api/target/1",
          volume_name: "FAKEDEVICE000",
          filesystems: [{ id: 1, name: "fs" }, { id: 2, name: "fs2" }],
          primary_server: "/api/host/3",
          primary_server_name: "test000",
          active_host_name: "test000",
          failover_server_name: "test001",
          available_actions: []
        }
      ]);
    });

    it("should render the title", () => {
      expect(el.querySelector(".section-header")).toHaveText("MGTs");
    });

    it("should render the label", () => {
      expect(el.querySelector("td")).toHaveText("MGS_49c000");
    });

    it("should link to the mgt detail page", () => {
      expect(el.querySelector("td a").getAttribute("route-to")).toBe("target/1");
    });

    it("should render the first filesystem", () => {
      expect(el.querySelector("td.comma-list a")).toHaveText("fs");
    });

    it("should render the second filesystem", () => {
      expect(el.querySelectorAll("td.comma-list a")[1]).toHaveText("fs2");
    });

    it("should render the first filesystem link", () => {
      expect(el.querySelector("td.comma-list a").getAttribute("route-to")).toBe("configure/filesystem/1");
    });

    it("should render the second filesystem link", () => {
      expect(el.querySelectorAll("td.comma-list a")[1].getAttribute("route-to")).toBe("configure/filesystem/2");
    });

    it("should render the volume name", () => {
      expect(el.querySelectorAll("td")[3]).toHaveText("FAKEDEVICE000");
    });

    it("should render the primary server name", () => {
      expect(el.querySelectorAll("td")[4]).toHaveText("test000");
    });

    it("should render the primary server link", () => {
      const route = el
        .querySelectorAll("td")[4]
        .querySelector("a")
        .getAttribute("route-to");
      expect(route).toBe("configure/server/3");
    });

    it("should render the failover server name", () => {
      expect(el.querySelectorAll("td")[5]).toHaveText("test001");
    });

    it("should render the active server name", () => {
      expect(el.querySelectorAll("td")[6]).toHaveText("test000");
    });
  });

  describe("without data", () => {
    it("should render nothing", () => {
      expect(el.querySelector(".mgt-component")).toBe(null);
    });
  });
});
