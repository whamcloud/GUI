// @flow

import WindowClickListener from "../../../source/iml/window-click-listener.js";
import { render } from "inferno";
import { renderToSnapshot } from "../../test-utils.js";
import { querySelector } from "../../../source/iml/dom-utils.js";

describe("WindowClickListener DOM testing", () => {
  let root, component, sibling;

  beforeEach(() => {
    const MockComponent = (props: { isOpen?: boolean, toggleOpen?: Function }) => {
      return (
        <span class="clicker" onClick={props.toggleOpen}>
          {props.isOpen ? "open" : "closed"}
        </span>
      );
    };

    root = document.createElement("div");
    sibling = document.createElement("div");
    querySelector(document, "body").appendChild(root);
    querySelector(document, "body").appendChild(sibling);
    component = (
      <WindowClickListener>
        <MockComponent />
      </WindowClickListener>
    );
  });

  afterEach(() => {
    querySelector(document, "body").removeChild(root);
    querySelector(document, "body").removeChild(sibling);
  });

  it("should throw on more than one child", () => {
    expect(() =>
      render(
        <WindowClickListener>
          <div />
          <div />
        </WindowClickListener>,
        root
      )
    ).toThrow();
  });

  it("should throw on zero children", () => {
    expect(() => render(<WindowClickListener />, root)).toThrow();
  });

  it("should render the child", () => {
    render(component, root);
    expect(renderToSnapshot(component)).toMatchSnapshot();
  });

  it("should open when clicked", () => {
    render(component, root);
    querySelector(root, ".clicker").click();

    expect(root.innerHTML).toMatchSnapshot();
  });

  it("should close when clicked twice", () => {
    render(component, root);
    const clicker = querySelector(root, ".clicker");
    clicker.click();
    clicker.click();
    expect(root.innerHTML).toMatchSnapshot();
  });

  it("should close when an adjacent el is clicked", () => {
    render(component, root);
    querySelector(root, ".clicker").click();
    sibling.click();
    expect(root.innerHTML).toMatchSnapshot();
  });
});
