import * as React from "react";
import SimpleWrapper from "./SimpleWrapper";
import { Consumer } from "./Consumer";

export interface Retainer<T> {
  map: <U extends any>(mapper: (t: T) => U) => Retainer<U>;
  flatMap: <U extends any>(mapper: (t: T) => Retainer<U>) => Retainer<U>;
  toComponent: () => Consumer<T>;

  toReactElement: <U extends React.ReactElement<any>>(
    this: Retainer<U>
  ) => React.ReactElement<any>;
}

export default SimpleWrapper;
