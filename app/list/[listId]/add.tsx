import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import {
  View,
  TextInput,
  Button,
  Platform,
  FlatList,
  Text,
  Pressable,
} from "react-native";
import { GroceryItem, useGroceryList } from "../../../lib/use-list";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { toArray } from "../../../lib/utils";
import { Icon } from "../../../lib/icon";

export default function AddListScreen() {
  const { listId } = useLocalSearchParams();
  const navigation = useNavigation();
  const isModal = navigation.canGoBack();
  const router = useRouter();

  if (!listId) {
    throw new Error("No list found");
  }

  const [snap, { createNewItem, destroyItem, setItem }] = useGroceryList(
    listId as string
  );
  const [name, setName] = useState<string | undefined>();

  function handleSubmit() {
    if (name === undefined) return;

    createNewItem({
      name,
      completed: false,
    });
    setName("");
  }

  const flatListItems = toArray(snap.items)
    .filter((i) => {
      if (i.deleted) return false;
      return name
        ? i.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
        : true;
    })
    .sort((a, b) => {
      // sort by timesAdded and then by name
      if (a.timesAdded > b.timesAdded) {
        return -1;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <View style={{ padding: 20 }}>
      <Stack.Screen
        options={{
          title: "Add to list",
          headerRight: isModal
            ? () => (
                <Button title="Dismiss" onPress={() => router.push("../")} />
              )
            : undefined,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          gap: 4,
        }}
      >
        <TextInput
          autoFocus
          onChangeText={setName}
          placeholder="Start typing..."
          value={name}
          style={{
            flex: 1,
            paddingVertical: 10,
            backgroundColor: "white",
            borderRadius: 15,
            paddingHorizontal: 20,
          }}
          onSubmitEditing={handleSubmit}
        />
        <View style={{ height: 50 }}>
          <Button title="Add" onPress={handleSubmit} />
        </View>
      </View>
      <FlatList
        data={flatListItems}
        renderItem={({ item }) => (
          <AddItem
            item={item}
            onRemove={() =>
              setItem(item.id, {
                ...item,
                completed: false,
                deleted: false,
              })
            }
            onAdd={() => {
              alert("todo");
              setItem(item.id, {
                ...item,
                //quantity: item.quantity ? 0 + 1,
              });
            }}
          />
        )}
      />

      {Platform.OS === "ios" && <StatusBar style="light" />}
    </View>
  );
}

function AddItem({
  item,
  onAdd,
  onRemove,
}: {
  item: GroceryItem;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const isAdded = !item.completed;
  const addColor = isAdded ? "green" : "black";

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text>{item.name}</Text>
      <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
        <Pressable onPress={onAdd}>
          <Icon name="add-circle" color={addColor} />
        </Pressable>
        <View style={{ width: 15, alignItems: "center" }}>
          <Text>{item.quantity ?? 0}</Text>
        </View>
        <Pressable onPress={onRemove}>
          <Icon name="remove-circle" color={addColor} />
        </Pressable>
      </View>
    </View>
  );
}
