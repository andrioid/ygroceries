import { useCallback, useEffect, useState } from "react";
import * as Y from "yjs";

export const useYMap = <T>(
  yobj: Y.AbstractType<T>
): Record<string, ExtractYEvent<T>> => {
  const [state, setState] = useState<Record<string, ExtractYEvent<T>>>(
    yobj.toJSON()
  );

  const updateState = useCallback(async () => {
    const stateNew: Record<string, ExtractYEvent<T>> = yobj.toJSON();
    setState((stateOld: Record<string, ExtractYEvent<T>>) =>
      !shallowCompare(stateNew, stateOld) ? stateNew : stateOld
    );
  }, []);

  useEffect(() => {
    yobj.observe(updateState);
    return () => {
      yobj.unobserve(updateState);
    };
  }, []);

  return state;
};

// Infer the generic type of a specific YEvent such as YMapEvent or YArrayEvent
// This is needed because YEvent is not generic.
type ExtractYEvent<T> = T extends Y.YMapEvent<infer U> | Y.YArrayEvent<infer U>
  ? U
  : never;

const shallowCompare = <T extends Record<string | number, unknown>>(
  obj1: T,
  obj2: T
) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    (key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
  );
