import { useContext, useEffect, useMemo } from "react";
import { YContext, useSharedDoc, useSharedText } from "./data";
import * as Y from "yjs";
import { randomUUID } from "expo-crypto";
import { toArray } from "./utils";
import { useSharedMap } from "./use-shared-map";

type ListMap = {
  id: string;
  name: string;
  items: Y.Map<GroceryItem>;
};

type ListSnapShot = {
  id: string;
  name: string;
  items: Record<string, GroceryItem>;
};

export type GroceryItem = {
  id: string;
  name: string;
  //catagoryId: string; // Later
  completed: boolean;
};

type HookReturns = [
  list: ListSnapShot,
  mutations: {
    setItem: (id: string, item: GroceryItem) => void;
    setName: (newName: string) => void;
    addItem: (item: Omit<GroceryItem, "id">) => void;
    deleteItem: (itemId: string) => void;
  }
];

export function useGroceryList(id: string): HookReturns {
  const yContext = useContext(YContext); // Sub documents later maybe
  if (yContext === null) {
    throw new Error("YContext provider not found, make sure to add it");
  }
  const { doc } = yContext;
  console.log("entry", Array.from(doc.getMap("").entries()));
  const [list, mutateList] = useSharedMap<ListMap, ListSnapShot>(id, doc);

  const mutations = {
    setName: (newName: string) => mutateList((m) => m.set("name", newName)),
    setItem: (id: string, item: GroceryItem) => {
      mutateList((m) => {
        const yList =
          (m.get("items") as Y.Map<GroceryItem>) || new Y.Map<GroceryItem>();
        yList.set(id, item);
      });
    },
    addItem: (item: Omit<GroceryItem, "id">) => {
      const id = randomUUID();
      mutateList((m) =>
        ensureItemList(m).set(id, {
          id: id,
          ...item,
        })
      );
    },
    deleteItem: (itemId: string) => {
      mutateList((m) => ensureItemList(m).delete(itemId));
    },
  };
  // TODO: Test this

  return [list, mutations];
}

const ITEM_KEY = "items";
function ensureItemList(
  rootMap: Y.Map<string | Y.Map<GroceryItem>>
): Y.Map<GroceryItem> {
  if (!rootMap.has(ITEM_KEY)) {
    const newItems = new Y.Map<GroceryItem>();
    rootMap.set(ITEM_KEY, newItems);
  }
  return rootMap.get(ITEM_KEY) as Y.Map<GroceryItem>;
}
