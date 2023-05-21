import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { View, Text, TextInput, Button, Platform } from "react-native";
import { useGroceryList } from "../../../lib/use-list";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

const groceryOptions: Array<string> = [
  "Mælk",
  "Æg",
  "Advokado",
  "Nakkekitteleter",
];
export default function AddListScreen() {
  const { listId } = useLocalSearchParams();
  const navigation = useNavigation();
  const isModal = navigation.canGoBack();
  const router = useRouter();

  if (!listId) {
    throw new Error("No list found");
  }

  const [, { createNewItem }] = useGroceryList(listId as string);
  const [name, setName] = useState<string | undefined>();

  function handleSubmit() {
    if (name === undefined) return;

    createNewItem({
      name,
      completed: false,
    });
    setName("");
  }

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
      <TextInput
        autoFocus
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
      {Platform.OS === "ios" && <StatusBar style="light" />}
    </View>
  );
}
