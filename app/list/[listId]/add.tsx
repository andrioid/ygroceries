import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, Button } from "react-native";
import { useGroceryList } from "../../../lib/use-list";
import { useState } from "react";

const groceryOptions: Array<string> = [
  "Mælk",
  "Æg",
  "Advokado",
  "Nakkekitteleter",
];
export default function AddListScreen() {
  const { listId } = useLocalSearchParams();
  if (!listId) {
    throw new Error("No list found");
  }

  const [, { addItem }] = useGroceryList(listId as string);
  const [name, setName] = useState<string | undefined>();

  function handleSubmit() {
    if (name === undefined) return;

    addItem({
      name,
      completed: false,
    });
    setName("");
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        onChangeText={setName}
        placeholder="Start typing..."
        value={name}
        style={{
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
  );
}
