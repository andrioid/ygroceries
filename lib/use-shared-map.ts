import { useCallback, useEffect, useState } from "react";
import * as Y from "yjs";

export function useSharedMap<T extends object, TO extends object = T>(
  name: string,
  doc: Y.Doc
) {
  const map = doc?.getMap<T[keyof T]>(name);
  const [snapshot, setSnapshot] = useState<TO>(
    getSharedMapSnapshot<T, TO>(map)
  );

  useEffect(() => {
    if (!map) {
      return;
    }
    const onChange = () => {
      const value = getSharedMapSnapshot<T, TO>(map);
      setSnapshot(value);
    };
    map.observeDeep(onChange);

    return () => {
      map.unobserveDeep(onChange);
    };
  }, [map]);

  const mutateMap = useCallback(
    (updator: (m: typeof map) => void) => {
      doc.transact(() => updator(map));
    },
    [doc, map]
  );

  return [snapshot, mutateMap] as const;
}

function getSharedMapSnapshot<T extends object, TO extends object = T>(
  map: Y.Map<T[keyof T]>
  // initialValue: T = {} as T
) {
  return map.toJSON() as TO;
  // return map.size === 0 ? initialValue : (map.toJSON() as T);
}
