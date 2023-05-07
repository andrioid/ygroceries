import { Text, View, Platform, Pressable, Button } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { YContext, useSharedDoc, useSharedMap } from "../lib/data";

export default function RootScreen() {
  const { doc } = useContext(YContext);
  const router = useRouter();
  //const doc = useSharedDoc("lists");
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ title: "Overview " }} />
      <Button title="List" onPress={() => router.push("/list/my-fancy-list")} />
    </View>
  );
}
