import completionistModule from "../../../../source/iml/completionist/completionist-module.js";
import angular from "../../../angular-mock-setup.js";

describe("completionist", () => {
  let completionist, completer, spy;

  beforeEach(angular.mock.module(completionistModule));

  beforeEach(
    angular.mock.inject($componentController => {
      spy = jest.fn();

      completer = jest.fn();

      completionist = $componentController("completionist", null, {
        completer
      });
    })
  );

  describe("parsing", () => {
    beforeEach(() => {
      completer.mockReturnValue(["food", "bard"]);
      completionist.register("VALUES", spy);
      completionist.parse("foo", 0);
    });

    it("should call the completer", () => {
      expect(completer).toHaveBeenCalledOnceWith({
        value: "foo",
        cursorPosition: 0
      });
    });

    it("should emit new values", () => {
      expect(spy).toHaveBeenCalledOnceWith(["food", "bard"]);
    });
  });

  it("should emit an event", () => {
    completionist.register("MY_EVENT", spy);
    completionist.emit("MY_EVENT", "PARTY!");

    expect(spy).toHaveBeenCalledOnceWith("PARTY!");
  });

  it("should deregister an event", () => {
    completionist.register("MY_EVENT", spy);
    completionist.deregister("MY_EVENT", spy);
    completionist.emit("MY_EVENT", "PARTY!");

    expect(spy).not.toHaveBeenCalled();
  });
});
