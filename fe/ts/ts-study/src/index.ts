interface SomeProps {
  a: string;
  b: number;
  c: () => void;
  d: () => void;
}

type getKeyByValueType<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? K : never;
}[keyof T];

type functionPropName = getKeyByValueType<SomeProps, Function>;
