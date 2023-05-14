import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSharedMap } from "../../lib/data";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useId } from "react";
import { randomUUID } from "expo-crypto";
import { useGroceryList } from "../../lib/use-list";

export default function ListScreen() {
  const pathname = usePathname();
  const [snap, { setName, addItem, setItem }] = useGroceryList("testlist123");
  const router = useRouter();
  console.log("render snap", snap);

  if (!snap) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{
          title: snap.name || "Untitled",
        }}
      />
      <Text style={{ marginBottom: 20 }}>List Name</Text>
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
      />
      <Text>List</Text>
      <FlatList
        data={snap.items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ListItem
            key={item.id}
            item={item}
            onRemove={(item) => {
              if (!snap.items) return;
              const idx = snap.items.findIndex((i) => i.id === item.id);
              if (idx === -1) {
                console.log("id not found when deleting");
                return;
              }
              const newItems = [...snap.items];
              newItems.splice(idx, 1);
              mutate("items", newItems);
            }}
          />
        )}
      />
      <Button
        title="Add"
        onPress={() => {
          addItem({ name: "Fancy pants", completed: false });
          return;
          // router.push("list/add", { onAddItem: });
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

function ListItem({
  item,
  onRemove,
}: {
  item: GroceryList["items"][number];
  onRemove: (item: GroceryList["items"][number]) => void;
}) {
  return (
    <View
      style={{
        minHeight: 50,
        backgroundColor: "white",
        padding: 10,
        marginVertical: 1,
      }}
    >
      <Text>{item.name}</Text>
      <Button title="Remove" onPress={() => onRemove(item)} />
    </View>
  );
}
