import * as React from "react";
import { Static } from "./Static";
import { RenderProp } from "./RenderProp";

export interface EnvironmentI<T> {
  map: <U extends any>(mapper: (t: T) => U) => Environment<U>;
  flatMap: <U extends any>(mapper: (t: T) => Environment<U>) => Environment<U>;
  toReactElement: <U extends React.ReactElement<any>>(
    this: Environment<U>
  ) => React.ReactElement<any>;
}

export type Environment<T> = RenderProp<T> | Static<T>;
