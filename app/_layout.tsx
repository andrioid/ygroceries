import { Stack } from "expo-router";
import { YProvider } from "../lib/data";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <YProvider roomId="fdasf">
      <Stack>
        <Stack.Screen name="list/add" options={{ presentation: "modal" }} />
      </Stack>
    </YProvider>
  );
}
