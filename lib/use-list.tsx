import { useContext, useEffect, useMemo } from "react";
import { YContext, useSharedDoc, useSharedMap, useSharedText } from "./data";
import * as Y from "yjs";
import { randomUUID } from "expo-crypto";
import { toArray } from "./utils";

type ListMap = {
  id: string;
  name: string;
  items: Y.Map<GroceryItem>;
};

type ListSnapShot = {
  id?: string;
  name?: string;
  items?: Array<GroceryItem>;
} | null;

type GroceryItem = {
  id: string;
  name: string;
  //catagoryId: string; // Later
  completed: boolean;
};

type HookReturns = [
  snapshot: ListSnapShot,
  mutations: {
    setItem: (id: string, item: GroceryItem) => void;
    setName: (newName: string) => void;
    addItem: (item: Omit<GroceryItem, "id">) => void;
  }
];

export function useGroceryList(id: string): HookReturns {
  const { doc } = useContext(YContext); // Sub documents later maybe

  const [list, mutateList] = useSharedMap<ListMap>(id, doc);
  // TODO: We need observeDeep for useSharedMap

  const snapshot = useMemo(() => {
    if (!list) return null;
    console.log("raw", list);
    return {
      id: list.id,
      name: list.name,
      items: list.items,
    };
  }, [list]) as ListSnapShot; // TODO: Make this smarter, works but why???

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
      console.log("trying to add", id, item);
      mutateList((m) => {
        const ITEM_KEY = "items";
        if (!m.has(ITEM_KEY)) {
          const newItems = new Y.Map<GroceryItem>();
          m.set(ITEM_KEY, newItems);
        }
        const mi = m.get(ITEM_KEY) as Y.Map<GroceryItem>;
        mi.set(id, {
          id: id,
          ...item,
        });
      });
    },
  };
  // TODO: Test this

  return [snapshot, mutations];
}
