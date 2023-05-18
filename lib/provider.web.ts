import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";
import { ProviderInit } from "./types";

export const init: ProviderInit = (doc: Y.Doc) => {
  return new IndexeddbPersistence("ygroceries", doc);
};
