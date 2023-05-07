import { Alert, Button, FlatList, Text, TextInput, View } from "react-native";
import { useSharedMap } from "../../lib/data";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useId } from "react";
import { randomUUID } from "expo-crypto";

type GroceryList = {
  id: string;
  name: string;
  items: Array<{
    id: string;
    name: string;
    completed: boolean;
  }>;
};

export default function ListScreen() {
  const pathname = usePathname();
  const [snap, mutate] = useSharedMap<GroceryList>(pathname);
  const router = useRouter();

  useEffect(() => {
    if (snap.items) return;
    if (!snap.items) {
      mutate("items", []);
    }
  }, [snap.items]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{
          title: snap.name,
        }}
      />
      <Text style={{ marginBottom: 20 }}>List Name</Text>
      <TextInput
        onChangeText={(newValue) => mutate("name", newValue)}
        defaultValue={snap.name}
        style={{
          minHeight: 50,
          backgroundColor: "white",
          borderRadius: 15,
          paddingHorizontal: 10,
          marginBottom: 20,
        }}
      />
      <Text>List {snap.items?.length}</Text>
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
          router.push("list/add");
          return;
          if (!snap.items) return;
          mutate("items", [
            ...snap.items,
            {
              id: randomUUID(),
              completed: false,
              name: "omg item",
            },
          ]);
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
