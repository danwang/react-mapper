import * as React from "react";

type ConsumerProps<T> = {
  children: (value: T) => React.ReactNode;
};
export type Consumer<T> = React.ComponentType<ConsumerProps<T>>;

export class Environment<T> {
  readonly ConsumerComponent: Consumer<T>;

  constructor(ConsumerComponent: Consumer<T>) {
    this.ConsumerComponent = ConsumerComponent;
  }

  map = <U extends any>(mapper: (t: T) => U): Environment<U> => {
    const { ConsumerComponent } = this;
    return make<U>((props: ConsumerProps<U>) => (
      <ConsumerComponent>
        {(t: T) => props.children(mapper(t))}
      </ConsumerComponent>
    ));
  };

  flatMap = <U extends any>(
    mapper: (t: T) => Environment<U>
  ): Environment<U> => {
    const Outer = this.ConsumerComponent;
    return make<U>((props: ConsumerProps<U>) => (
      <Outer>
        {(t: T) => {
          const env = mapper(t);
          const Inner = env.ConsumerComponent;
          return <Inner>{props.children}</Inner>;
        }}
      </Outer>
    ));
  };

  toComponent = (): Consumer<T> => this.ConsumerComponent;

  toReactElement = <U extends React.ReactElement<any>>(
    this: Environment<U>
  ): React.ReactElement<any> => {
    const { ConsumerComponent } = this;
    return <ConsumerComponent>{x => x}</ConsumerComponent>;
  };
}

const make = <T extends any>(consumer: Consumer<T>): Environment<T> =>
  new Environment(consumer);

export default { make };
