import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { WebsocketProvider } from "./websocket-provider";
import * as Y from "yjs";

interface Props {
  roomId: string;
  children: ReactNode;
}

type ContextValue = {
  doc: Y.Doc;
  provider: null | WebsocketProvider;
};
const doc = new Y.Doc();

export const YContext = createContext<ContextValue>({
  doc,
  provider: null,
});

export function YProvider({ roomId, children }: Props) {
  const providerRef = useRef<ContextValue["provider"]>(null);
  useEffect(() => {
    if (!roomId) return;

    providerRef.current = new WebsocketProvider(
      "ws://10.8.4.38:1234",
      "groceries",
      doc
    );

    providerRef.current.on("status", (event: unknown) => {
      console.log("ws status", event);
    });

    providerRef.current.on("sync", (event: unknown) => {
      console.log("ws sync", event);
    });

    providerRef.current.on("connection-close", (event: unknown) => {
      console.log("ws-closed", event);
    });

    providerRef.current.on("connection-error", (event: unknown) => {
      console.log("ws-error", event);
    });

    return () => {
      providerRef.current?.destroy();
      providerRef.current = null;
    };
  }, [roomId]);

  return (
    <YContext.Provider value={{ doc, provider: providerRef.current }}>
      {children}
    </YContext.Provider>
  );
}

export function useSharedMap<
  T extends Record<
    string,
    object | boolean | string | number | Uint8Array | Y.AbstractType<any>
  >
>(name: string) {
  const { doc } = useContext(YContext);
  const map = doc.getMap<T[keyof T]>(name);

  const [snapshot, setSnapshot] = useState<Partial<T>>(
    getSharedMapSnapshot<T>(map)
  );

  useEffect(() => {
    const onChange = () => {
      const value = getSharedMapSnapshot<T>(map);
      setSnapshot(value);
    };
    map.observe(onChange);

    return () => {
      map.unobserve(onChange);
    };
  }, [map]);

  const mutate = useCallback(
    <FieldKey extends keyof T>(field: FieldKey, value: T[FieldKey]) => {
      doc.transact(() => {
        map.set(field as string, value);
      });
    },
    [doc, map]
  );

  return [snapshot, mutate] as const;
}

export function useSharedDoc(name: string) {
  const { doc } = useContext(YContext);
  const rootFolder = doc.getMap();
  const subdoc = rootFolder.get(name) as Y.Doc;

  useEffect(() => {
    subdoc.load();
    return () => subdoc.destroy();
  });

  return subdoc;
}

function getSharedMapSnapshot<T extends object>(
  map: Y.Map<T[keyof T]>
  // initialValue: T = {} as T
) {
  return map.toJSON() as T;
  // return map.size === 0 ? initialValue : (map.toJSON() as T);
}

function getSubDocSnapshot(name: string) {
  const { doc } = useContext(YContext);
}
