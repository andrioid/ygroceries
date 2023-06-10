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
          gap: 5,
        }}
      >
        <TextInput
          autoFocus
          onChangeText={setName}
          placeholder="Start typing..."
          value={name}
          style={{
            flex: 1,
            minHeight: 50,
            backgroundColor: "white",
            borderRadius: 15,
            paddingHorizontal: 10,
            marginBottom: 20,
            marginTop: 20,
          }}
          onSubmitEditing={handleSubmit}
        />
        <Button title="Add" onPress={handleSubmit} />
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
      }}
    >
      <Pressable>
        <Icon name="add-circle" color={addColor} />
      </Pressable>
      <Text>{item.name}</Text>
      <Pressable onPress={onRemove}>
        <Icon name="remove-circle" color={addColor} />
      </Pressable>
    </View>
  );
}
