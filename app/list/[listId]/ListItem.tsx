import { Text, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { GroceryItem } from "../../../lib/use-list";
import { SwipeableRow } from "../swipable-row";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";

export function ListItem({
  item,
  onRemove,
  onToggle,
}: {
  item: GroceryItem;
  onRemove: (item: GroceryItem) => void;
  onToggle: (item: GroceryItem) => void;
}) {
  const textRef = useRef(Text.prototype);
  const animated = useSharedValue(item.completed ? 1 : 0);

  const textPos = useSharedValue({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  // useEffect(() => {
  //   textRef.current.measure((x, y, w, h) => {
  //     console.log("textpos", x, y, w, h);
  //     textPos.value = { x, y, w, h };
  //   });
  // }, [textRef.current]);

  const animationConfig = {
    duration: 2000,
    easing: Easing.out(Easing.exp),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: interpolate(animated.value, [0, 1], [0, textPos.value.w]),
      left: textPos.value.x,
      top: textPos.value.y + textPos.value.h * 0.5,
    };
  }, [textPos]);

  const handleFinished = (finished?: boolean) => {
    if (!finished) return;
    onToggle(item);
  };

  function handleToggle() {
    if (item.completed) {
      animated.value = 0;
      onToggle(item); // no animation on undo
      return;
    }
    // Animating, abort
    if (animated.value > 0) {
      console.log("aborted");
      animated.value = 0;
      return;
    }

    animated.value = withTiming(1, animationConfig, (finished) =>
      runOnJS(handleFinished)(finished)
    );
  }

  return (
    <Animated.View>
      <SwipeableRow
        actions={[
          {
            label: "Destroy!",
            color: "#bb0000",
            onPress: () => onRemove(item),
          },
        ]}
        onPress={handleToggle}
      >
        <Animated.View
          style={{
            position: "relative",
            minHeight: 50,
            backgroundColor: item.completed ? "#eeeeee" : "white",
            padding: 10,
            marginVertical: 2,
            paddingHorizontal: 20,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            onLayout={(e) => {
              const { x, y, width, height } = e.nativeEvent.layout;
              textPos.value = { x, y, w: width, h: height };
            }}
          >
            {item.name}
          </Text>
          {item.completed && <Ionicons name="checkmark" size={24} />}
          <Animated.View style={[styles.strike, style]} />
        </Animated.View>
      </SwipeableRow>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strike: {
    backgroundColor: "black",
    position: "absolute",
    top: 5,
    left: 5,
    height: 1,
    width: 100,
    //top: 2,
  },
});
