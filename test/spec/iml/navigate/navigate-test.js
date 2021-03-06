import navigateModule from "../../../../source/iml/navigate/navigate-module";
import angular from "../../../angular-mock-setup.js";

describe("navigate", () => {
  let $window;

  beforeEach(
    angular.mock.module(navigateModule, { UI_ROOT: "/root/of/app/" }, $provide => {
      $window = {
        location: {
          href: ""
        }
      };

      $provide.value("$window", $window);
    })
  );

  let navigate, UI_ROOT;

  beforeEach(
    angular.mock.inject((_navigate_, _UI_ROOT_) => {
      navigate = _navigate_;
      UI_ROOT = _UI_ROOT_;
    })
  );

  it("should accept no arguments", () => {
    navigate();

    expect($window.location.href).toBe(UI_ROOT);
  });

  it("should concatenate the part with the ui root", () => {
    const part = "foo";

    navigate(part);

    expect($window.location.href).toBe(UI_ROOT + part);
  });
});
