import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const LIST_ID_KEY = "lists4";

type ListEntry = {
  id: string;
  name: string;
  shared: boolean;
};

type ListIndexReturns = [
  queries: { lists: Array<ListEntry>; isLoading: boolean },
  mutations: { createList: () => void }
];

// Abstract persistance of lists. Start with local, but eventually add shared lists too.
export function useListIndex(): ListIndexReturns {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lists, setLists] = useState<Array<ListEntry>>([]);
  // Initial state
  useEffect(() => {
    setIsLoading(true);
    AsyncStorage.getItem(LIST_ID_KEY).then((lists) => {
      if (lists) {
        setLists(JSON.parse(lists));
        setIsLoading(false);
      }
    });
  }, []);

  function createList(name?: string) {
    const list = {
      id: randomUUID(),
      name: name ?? "Untitled",
      shared: false,
    };
    setLists([...lists, list]);
    AsyncStorage.setItem(LIST_ID_KEY, JSON.stringify([...lists, list]));
  }

  return [
    {
      lists: [
        ...lists,
        // Temporary demo entry
        { id: "my-fancy-list", name: "Demo List", shared: true },
      ],
      isLoading,
    },
    { createList },
  ];
}
