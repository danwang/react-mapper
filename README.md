# Retainer

![badge](https://img.shields.io/badge/🔥-Blazing%20Fast-red.svg)
![badge](https://img.shields.io/badge/λ-Functional-blue.svg "Code functions and works as expected")
![badge](https://img.shields.io/badge/🏢-Enterprise%20Grade-999999.svg "With six nines of CSS hex color codes")

Retainer (_React_ + _container_) is a small tool to compose [render prop components](https://reactjs.org/docs/render-props.html).

# Installation

```
yarn add @danwang/retainer
```

# Usage

A `Consumer<T>` is a React component that accepts a single prop `children` of
type `(T) => ReactNode`.

A `Retainer<T>` is a container wrapping a `Consumer<T>` with methods for
transforming the provided values.

A typical flow looks like:

1.  Put the component in a `Retainer`
2.  Transform the `Retainer`
3.  Extract a component or ReactElement from the `Retainer`

# Example

Using the context API (React 16.3+):

```jsx
import * as Retainer from "@danwang/retainer";

const Context = React.createContext({
  value: 0,
  setValue: () => () => {}
});

class App extends React.Component {
  state = { value: 0 };
  handleSetValue = (value: number) => () => this.setState({ value });
  render() {
    const context = {
      value: this.state.value,
      setValue: this.handleSetValue
    };
    return (
      <Context.Provider value={context}>
        <Root />
      </Context.Provider>
    );
  }
}

const Root = () =>
  Retainer.make(Context.Consumer)
    .map(context => (
      <div>
        Count is {context.value}
        <button onClick={context.setValue(context.value + 1)}>+</button>
      </div>
    ))
    .toReactElement();

ReactDOM.render(<App />, element);
```

# API

## Creation

### `Retainer.make: <T>(component: Consumer<T>) => Retainer<T>`

Creates a `Retainer` containing the component.

## Transformation

### `Retainer<T>.map: <U>(mapper: (T) => U) => Retainer<U>`

Applies a function to the provided value of the interior component.

### `Retainer<T>.flatMap: <U>(mapper: (T) => Retainer<U>) => Retainer<U>`

Applies a function returning a `Retainer` to the provided value of the interior
component, flattening one level of nested `Retainer`s.

## Extraction

### `Retainer<T>.toComponent: () => Consumer<T>`

Returns a render prop component that provides the interior value.

### `Retainer<ReactElement>.toReactElement: () => ReactElement`

If the interior type is a `ReactElement`, returns a `ReactElement` which, when
mounted, mounts necessary `Consumer` components to render the interior value.
