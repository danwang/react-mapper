import * as React from "react";
import { Retainer, Consumer, ConsumerProps } from "./Retainer";
import WithTransform from "./WithTransform";

class SimpleWrapper<T> implements Retainer<T> {
  readonly Component: Consumer<T>;

  constructor(Component: Consumer<T>) {
    this.Component = Component;
  }

  map = <U extends any>(mapper: (t: T) => U): Retainer<U> => {
    return WithTransform.make<T, U>(this.Component, mapper);
  };

  flatMap = <U extends any>(mapper: (t: T) => Retainer<U>): Retainer<U> => {
    const Outer = this.Component;
    return make<U>((props: ConsumerProps<U>) => (
      <Outer>
        {(t: T) => {
          const Inner = mapper(t).toComponent();
          return <Inner>{props.children}</Inner>;
        }}
      </Outer>
    ));
  };

  toComponent = (): Consumer<T> => this.Component;

  toReactElement = <U extends React.ReactElement<any>>(
    this: Retainer<U>
  ): React.ReactElement<any> => {
    const { Component } = this;
    return <Component>{x => x}</Component>;
  };
}

const make = <T extends any>(consumer: Consumer<T>): Retainer<T> =>
  new SimpleWrapper(consumer);

export default { make };
