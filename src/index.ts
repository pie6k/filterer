type Property = string | number | symbol;

type Path = Property[];

export interface RecordedSet {
  path: Path;
  value: any;
}

export type ArrayCompare = 'includes';
export type NumberCompare = '<' | '<=' | '==' | '>' | '>=';
export type StringCompare = '<' | '<=' | '==' | '>' | '>=';

export type NumberFilter = number | [NumberCompare, number];
export type StringFilter = string | [StringCompare, string];

export type FiltersSetter<T> = {
  [K in keyof T]: T[K] extends Array<infer I>
    ? [ArrayCompare, I]
    : T[K] extends number
    ? NumberFilter
    : T[K] extends string
    ? StringFilter
    : T[K] extends boolean
    ? boolean
    : FiltersSetter<T[K]>;
};

function createProxy<T extends object>(
  currentPath: Path,
  onSet: (path: Path, value: any) => void,
): T {
  const proxy = new Proxy<T>({} as any, {
    get(target, property) {
      return createProxy([...currentPath, property], onSet);
    },
    set(target, property, value) {
      const fullPath = [...currentPath, property];
      onSet(fullPath, value);
      return false;
    },
  });

  return proxy;
}

export function createFilters<T extends object>(
  callback: (input: FiltersSetter<T>) => void,
) {
  const records: RecordedSet[] = [];

  const proxyRoot = createProxy<FiltersSetter<T>>([], (path, value) => {
    records.push({ path, value });
  });

  callback(proxyRoot);

  return records;
}

export default createFilters;
