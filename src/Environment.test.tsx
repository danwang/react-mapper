import Environment from "./Environment";
import * as React from "react";
import * as invariant from "invariant";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

type Props = { children: (value: string) => React.ReactNode };
type State = { value: string };

const setup = () => {
  const changers: Array<(value: string) => void> = [];

  class Consumer extends React.Component<Props, State> {
    state: State = { value: "default" };
    changeValue = (value: string) => this.setState({ value });
    componentWillMount() {
      changers.push(this.changeValue);
    }

    componentWillUnmount() {
      const i = changers.indexOf(this.changeValue);
      invariant(i >= 0, "Could not find changeValue during unmount");
      changers.splice(i, 1);
    }

    render() {
      return this.props.children(this.state.value);
    }
  }
  return { changers, Consumer };
};

describe("Environment", () => {
  test("It renders and responds to changes in value", () => {
    const { changers, Consumer } = setup();
    const environment = Environment.make(Consumer).map(v => <div>{v}</div>);
    const wrapper = Enzyme.mount(environment.toReactElement());

    expect(wrapper.text()).toBe("default");
    expect(changers.length).toBe(1);
    changers[0]("bar");
    expect(wrapper.text()).toBe("bar");
  });

  describe("flatMap", () => {
    test("It works with multiple values", () => {
      const { changers, Consumer } = setup();
      const env1 = Environment.make(Consumer);
      const env2 = Environment.make(Consumer);
      const environment = env1.flatMap(value1 =>
        env2.map(value2 => (
          <div>
            {value1}/{value2}
          </div>
        ))
      );
      const wrapper = Enzyme.mount(environment.toReactElement());

      expect(wrapper.text()).toBe("default/default");
      expect(changers.length).toBe(2);
      changers[0]("foo");
      expect(wrapper.text()).toBe("foo/default");
      changers[1]("bar");
      expect(wrapper.text()).toBe("foo/bar");
    });
  });
});
