import * as React from "react";
import { Retainer } from "./Retainer";
import { Consumer, ConsumerProps } from "./Consumer";
import SimpleWrapper from "./SimpleWrapper";

const compose2 = <A, B, C>(f: (b: B) => C, g: (A: A) => B): ((a: A) => C) => {
  return (a: A) => f(g(a));
};

class WithTransform<Raw, T> implements Retainer<T> {
  readonly Component: Consumer<Raw>;
  readonly transform: (raw: Raw) => T;

  constructor(Component: Consumer<Raw>, transform: (raw: Raw) => T) {
    this.Component = Component;
    this.transform = transform;
  }

  map = <U extends any>(mapper: (t: T) => U): Retainer<U> => {
    return make<Raw, U>(this.Component, compose2(mapper, this.transform));
  };

  flatMap = <U extends any>(mapper: (t: T) => Retainer<U>): Retainer<U> => {
    const Outer = this.Component;
    return SimpleWrapper.make<U>((props: ConsumerProps<U>) => (
      <Outer>
        {(raw: Raw) => {
          const Inner = mapper(this.transform(raw)).toComponent();
          return <Inner>{props.children}</Inner>;
        }}
      </Outer>
    ));
  };

  toComponent = (): Consumer<T> => {
    return (props: ConsumerProps<T>) => (
      <this.Component>
        {compose2(props.children, this.transform)}
      </this.Component>
    );
  };

  toReactElement = <U extends React.ReactElement<any>>(
    this: Retainer<U>
  ): React.ReactElement<any> => {
    return <this.Component>{this.transform}</this.Component>;
  };
}

const make = <Raw, T>(
  consumer: Consumer<Raw>,
  transform: (raw: Raw) => T
): WithTransform<Raw, T> => new WithTransform(consumer, transform);

export default { make };
