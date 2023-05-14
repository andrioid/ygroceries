import React, { Component } from "react";
import { Animated, StyleSheet, Text, View, I18nManager } from "react-native";

import { RectButton, Swipeable } from "react-native-gesture-handler";

export function SwipeableRow({
  children,
  actions = [],
}: {
  children: React.ReactNode;
  actions: Array<{
    label: string;
    onPress: () => void;
    color: string;
  }>;
}) {
  return (
    <Swipeable
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
      {children}
    </Swipeable>
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
