import { Text, View } from "react-native";
import { Stack } from "expo-router";

export default function RootScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ title: "Overview " }} />
      <Text>Moo</Text>
    </View>
  );
}
