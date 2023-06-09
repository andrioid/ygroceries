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
import { Awareness } from "y-protocols/awareness";
import { init as initProvider } from "./provider";

interface Props {
  roomId: string;
  children: ReactNode;
}

type ContextValue = {
  doc: Y.Doc;
  provider: null | WebsocketProvider;
};
const doc = new Y.Doc();

initProvider(doc);

export const YContext = createContext<ContextValue>({
  doc,
  provider: null,
});

export function YProvider({ roomId, children }: Props) {
  const providerRef = useRef<ContextValue["provider"]>(null);
  useEffect(() => {
    if (!roomId) return;

    providerRef.current = new WebsocketProvider(
      "wss://yserver.fly.dev",
      "groceries",
      doc
    );

    // TODO: Create hook for document status
    //
    // providerRef.current.on("status", (event: unknown) => {
    //   console.log("ws status", event);
    // });

    // providerRef.current.on("sync", (event: unknown) => {
    //   console.log("ws sync", event);
    // });

    // providerRef.current.on("connection-close", (event: unknown) => {
    //   console.log("ws-closed", event);
    // });

    // providerRef.current.on("connection-error", (event: unknown) => {
    //   console.log("ws-error", event);
    // });

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

export function useSharedText(name: string, doc: Y.Doc) {
  const text = doc.getText(name);

  const [snapshot, setSnapshot] = useState<string>(text.toJSON());

  useEffect(() => {
    const onChange = () => {
      const value = text.toJSON();
      setSnapshot(value);
    };
    text.observe(onChange);
    return () => {
      text.unobserve(onChange);
    };
  }, [text]);

  const mutateText = useCallback(
    (updator: (t: Y.Text) => void) => {
      doc.transact(() => updator(text));
    },
    [doc, text]
  );

  return [snapshot, mutateText] as const;
}

export function useSharedDoc(name: string) {
  const { doc: rootDoc } = useContext(YContext);
  let subdoc = useRef<Y.Doc | null>(null);

  useEffect(() => {
    if (!rootDoc) {
      throw new Error("No root document");
    }
    const rootFolder = rootDoc.getMap();
    if (!rootFolder) {
      throw new Error("No root folder");
    }
    if (rootFolder.has(name)) {
      subdoc.current = rootFolder.get(name) as Y.Doc;
      //subdoc.current?.load();
    } else {
      rootFolder.set(name, subdoc);
    }

    return () => subdoc.current?.destroy();
  }, [rootDoc]);

  return subdoc.current;
}

function getSharedMapSnapshot<T extends object>(
  map: Y.Map<T[keyof T]>
  // initialValue: T = {} as T
) {
  return map.toJSON() as T;
  // return map.size === 0 ? initialValue : (map.toJSON() as T);
}

/**
 * Get and subscribe to awareness state.
 */
export function useAwareness<T extends object>() {
  const { provider } = useContext(YContext);
  //const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (!provider) {
      return;
    }

    const onChange = () => {
      //forceUpdate();
    };
    provider.awareness.on("change", onChange);
    return () => {
      provider.awareness.off("change", onChange);
    };
  }, [provider]);

  const states = provider
    ? getAwarenessStateSnapshot<T>(provider.awareness)
    : {};

  const setLocalState = useCallback(
    (state: T) => {
      provider?.awareness.setLocalState(state);
    },
    [provider]
  );

  return {
    clientId: provider ? String(provider.awareness.clientID) : "",
    count: Object.keys(states).length,
    states,
    setLocalState,
  } as const;
}

function getAwarenessStateSnapshot<T extends object>(awareness: Awareness) {
  const states = Object.fromEntries(
    (awareness.getStates() as Map<number, T>).entries()
  );
  return states;
}
