import * as React from "react";
import { Environment, EnvironmentI } from "./Environment";

type ConsumerProps<T> = {
  children: (value: T) => React.ReactNode;
};
export type Consumer<T> = React.ComponentType<ConsumerProps<T>>;

export class Static<T> implements EnvironmentI<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  map = <U extends any>(mapper: (t: T) => U): Environment<U> =>
    make(mapper(this.value));

  flatMap = <U extends any>(mapper: (t: T) => Environment<U>): Environment<U> =>
    mapper(this.value);

  toReactElement = <U extends React.ReactElement<any>>(
    this: Environment<U>
  ): React.ReactElement<any> => {
    // @ts-ignore
    return this.value;
  };
}

const make = <T extends any>(value: T): Environment<T> => new Static(value);

export default { make };
