import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Stack,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { useEffect, useId } from "react";
import { randomUUID } from "expo-crypto";
import { useGroceryList } from "../../../lib/use-list";
import { toArray } from "../../../lib/utils";
import { Swipeable } from "react-native-gesture-handler";
import { ListItem } from "./ListItem";

export default function ListScreen() {
  const { listId } = useLocalSearchParams();
  if (!listId) {
    throw new Error("No list found");
  }
  const [snap, { setItem, destroyItem }] = useGroceryList(listId as string);
  const router = useRouter();

  if (!snap) {
    return <ActivityIndicator />;
  }

  const items = toArray(snap.items)
    .filter((i) => i.deleted === false)
    .sort((a, b) => {
      if (a.completed && !b.completed) {
        return 1;
      }
      if (!a.completed && b.completed) {
        return -1;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{
          title: snap.name || "Shopping List",
        }}
      />
      {/* <Text style={{ marginBottom: 20 }}>List Name</Text>
      <TextInput
        onChangeText={(newValue) => setName(newValue)}
        defaultValue={snap.name}
        style={{
          minHeight: 50,
          backgroundColor: "white",
          borderRadius: 15,
          paddingHorizontal: 10,
          marginBottom: 20,
        }}
      /> */}
      <Text style={{ marginBottom: 20 }}>List</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ListItem
            key={item.id}
            item={item}
            onRemove={(item) => {
              destroyItem(item.id);
            }}
            onToggle={(item) => {
              setItem(item.id, {
                ...item,
                completed: !item.completed,
              });
            }}
          />
        )}
      />
      <Button
        title="Add"
        onPress={() => {
          router.push({
            pathname: `list/${listId}/add`,
          });
          // mutateMap((m) =>
          //   m.set("asdf", {
          //     id: "moo",
          //   })
          // );
          // return;
          // if (!snap.items) return;
          // mutate("items", [
          //   ...snap.items,
          //   {
          //     id: randomUUID(),
          //     completed: false,
          //     name: "omg item",
          //   },
          // ]);
        }}
      />
    </View>
  );
}
