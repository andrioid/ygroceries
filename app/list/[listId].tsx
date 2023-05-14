import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useId } from "react";
import { randomUUID } from "expo-crypto";
import { GroceryItem, useGroceryList } from "../../lib/use-list";
import { toArray } from "../../lib/utils";
import { Swipeable } from "react-native-gesture-handler";
import { SwipeableRow } from "./swipable-row";

export default function ListScreen() {
  const pathname = usePathname();
  const [snap, { setName, addItem, setItem, deleteItem }] =
    useGroceryList("testlist12443");
  const router = useRouter();
  console.log("render snap", snap);

  if (!snap) {
    return <ActivityIndicator />;
  }

  const items = toArray(snap.items);
  console.log("items", items);
  console.log("snap items", snap.items);
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
      <Text style={{ marginBottom: 20 }}>List</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ListItem
            key={item.id}
            item={item}
            onRemove={(item) => {
              deleteItem(item.id);
            }}
          />
        )}
      />
      <Button
        title="Add"
        onPress={() => {
          router.push({
            pathname: "list/add",
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

function ListItem({
  item,
  onRemove,
}: {
  item: GroceryItem;
  onRemove: (item: GroceryItem) => void;
}) {
  return (
    <View>
      <SwipeableRow
        actions={[
          {
            label: "Destroy!",
            color: "#bb0000",
            onPress: () => onRemove(item),
          },
        ]}
      >
        <View
          style={{
            minHeight: 50,
            backgroundColor: "white",
            padding: 10,
            marginVertical: 2,
            justifyContent: "center",
          }}
        >
          <Text>{item.name}</Text>
        </View>
      </SwipeableRow>
    </View>
  );
}
