import * as React from "react";
import { Environment, EnvironmentI } from "./Environment";
import { Static } from "./Static";

type ConsumerProps<T> = {
  children: (value: T) => React.ReactNode;
};
export type Consumer<T> = React.ComponentType<ConsumerProps<T>>;

export class RenderProp<T> implements EnvironmentI<T> {
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
          if (env instanceof Static) {
            return props.children(env.value);
          } else {
            const Inner = env.ConsumerComponent;
            return <Inner>{props.children}</Inner>;
          }
        }}
      </Outer>
    ));
  };

  toReactElement = <U extends React.ReactElement<any>>(
    this: Environment<U>
  ): React.ReactElement<any> => {
    const { ConsumerComponent } = this;
    return <ConsumerComponent>{x => x}</ConsumerComponent>;
  };
}

const make = <T extends any>(consumer: Consumer<T>): Environment<T> =>
  new RenderProp(consumer);

export default { make };
