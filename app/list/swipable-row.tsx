import React, { Component, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  I18nManager,
  Pressable,
} from "react-native";

import {
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";

export function SwipeableRow({
  children,
  actions = [],
  onPress,
}: {
  children: React.ReactNode;
  actions: Array<{
    label: string;
    onPress: () => void;
    color: string;
  }>;
  onPress?: () => void;
}) {
  const [allowPress, setAllowPress] = useState(true);
  return (
    <GestureHandlerRootView>
      <Swipeable
        onActivated={() => setAllowPress(false)}
        onEnded={() => setAllowPress(true)}
        renderRightActions={() => {
          return (
            <View style={{ width: 192 }}>
              {actions.map((action) => (
                <Animated.View
                  key={JSON.stringify(action)}
                  style={{ flex: 1, transform: [{ translateX: 0 }] }}
                >
                  <RectButton
                    style={[
                      styles.rightAction,
                      { backgroundColor: action.color },
                    ]}
                    onPress={action.onPress}
                  >
                    <Text style={styles.actionText}>{action.label}</Text>
                  </RectButton>
                </Animated.View>
              ))}
            </View>
          );
        }}
      >
        <Pressable disabled={!allowPress} onPress={onPress}>
          {children}
        </Pressable>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
