import { View, Button, Text, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { YContext } from "../lib/data";
import { useListIndex } from "../lib/use-list-index";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RootScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { doc } = useContext(YContext);
  const router = useRouter();
  const [{ lists }, { createList }] = useListIndex();

  //const doc = useSharedDoc("lists");
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }}
    >
      <Stack.Screen
        options={{
          title: "yGroceries",
          headerRight: () => (
            <Button title="Add" onPress={() => createList()} />
          ),
        }}
      />
      {lists.map((list) => (
        <Pressable
          key={list.id}
          onPress={() => router.push(`/list/${list.id}`)}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{list.name}</Text>
          <Ionicons
            name={list.shared ? "cloud-outline" : "cloud-offline"}
            style={{ marginLeft: 5 }}
          />
        </Pressable>
      ))}
      <View className="bg-red-500">
        <Text className="text-2xl text-pink-600">tailwind test</Text>
      </View>
    </View>
  );
}
