import { Stack } from "expo-router";
import { View, Text, TextInput, Button } from "react-native";
import { useGroceryList } from "../../lib/use-list";
import { useState } from "react";

const groceryOptions: Array<string> = [
  "Mælk",
  "Æg",
  "Advokado",
  "Nakkekitteleter",
];
export default function AddListScreen() {
  const [, { addItem }] = useGroceryList("testlist12443");
  const [name, setName] = useState<string>("");
  return (
    <View>
      <TextInput
        onChangeText={setName}
        style={{
          minHeight: 50,
          backgroundColor: "white",
          borderRadius: 15,
          paddingHorizontal: 10,
          marginBottom: 20,
        }}
      />
      <Button
        title="Add"
        onPress={() =>
          addItem({
            name,
            completed: false,
          })
        }
      />
    </View>
  );
}
