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
  //catagories: Y.Map<CategoryItem>; // Later
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
  deleted: boolean;
  quantity?: string; // e.g. "2", "2l", "200g"

  createdAt: Date;
  lastUsedAt: Date;
  timesAdded: number;
};

export type CatagoryItem = {
  id: string;
  name: string;
  color: string;
  //icon: GroceryIcon; // Later
};

//type GroceryIcon = "" // Later

type HookReturns = [
  list: ListSnapShot,
  mutations: {
    setItem: (id: string, item: GroceryItem) => void;
    setName: (newName: string) => void;
    createNewItem: (item: Partial<GroceryItem>) => void;
    destroyItem: (itemId: string) => void;
    //markCompleted: (itemId: string) => void;
    //markDeleted: (itemId: string) => void;
    increase: (itemId: string) => void;
    decrease: (itemId: string) => void;
  }
];

export function useGroceryList(id: string): HookReturns {
  const yContext = useContext(YContext); // Sub documents later maybe
  if (yContext === null) {
    throw new Error("YContext provider not found, make sure to add it");
  }
  const { doc } = yContext;
  const [list, mutateList] = useSharedMap<ListMap, ListSnapShot>(id, doc);

  const mutations = {
    setName: (newName: string) => mutateList((m) => m.set("name", newName)),

    // Modify an existing item. Almost any action is setItem
    setItem: (id: string, item: GroceryItem) => {
      mutateList((m) => {
        const yList =
          (m.get("items") as Y.Map<GroceryItem>) || new Y.Map<GroceryItem>();
        yList.set(id, item);
      });
    },
    // Create a new item
    createNewItem: (item: Partial<GroceryItem>) => {
      const id = randomUUID();
      mutateList((m) =>
        ensureItemList(m).set(id, {
          id: id,
          name: item.name ?? "Default",
          completed: item.completed ?? false,
          deleted: item.deleted ?? false,
          createdAt: item.createdAt ?? new Date(),
          lastUsedAt: item.lastUsedAt ?? new Date(),
          timesAdded: item.timesAdded ?? 1,
          quantity: item.quantity ?? "1",
        })
      );
    },
    // Completely removes a record. Rarely used.
    destroyItem: (itemId: string) => {
      mutateList((m) => ensureItemList(m).delete(itemId));
    },

    // Increases quantity, understands units if any
    increase: (itemId: string) => {},

    // Decreases or deletes, dependin on quantity value
    decrease: (itemId: string) => {},
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
