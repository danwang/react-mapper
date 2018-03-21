import * as React from "react";

export type ConsumerProps<T> = {
  children: (value: T) => React.ReactNode;
};
export type Consumer<T> = React.ComponentType<ConsumerProps<T>>;
