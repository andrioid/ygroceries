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
import { GroceryItem, useGroceryList } from "../../../lib/use-list";
import { toArray } from "../../../lib/utils";
import { Swipeable } from "react-native-gesture-handler";
import { SwipeableRow } from "../swipable-row";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ListScreen() {
  const { listId } = useLocalSearchParams();
  if (!listId) {
    throw new Error("No list found");
  }
  const [snap, { setName, addItem, setItem, deleteItem }] = useGroceryList(
    listId as string
  );
  const router = useRouter();

  if (!snap) {
    return <ActivityIndicator />;
  }

  const items = toArray(snap.items);
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
              deleteItem(item.id);
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

function ListItem({
  item,
  onRemove,
  onToggle,
}: {
  item: GroceryItem;
  onRemove: (item: GroceryItem) => void;
  onToggle: (item: GroceryItem) => void;
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
        onPress={() => onToggle(item)}
      >
        <View
          style={{
            minHeight: 50,
            backgroundColor: "white",
            padding: 10,
            marginVertical: 2,
            paddingHorizontal: 20,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>{item.name}</Text>
          {item.completed && <Ionicons name="checkmark" size={24} />}
        </View>
      </SwipeableRow>
    </View>
  );
}
