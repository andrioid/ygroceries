import Ionicons from "@expo/vector-icons/Ionicons";
// 30: Veneto

const iconList = {
  "cloud-outline": {
    iconset: Ionicons,
    name: "cloud-outline",
  },
  checkmark: {
    iconset: Ionicons,
    name: "checkmark",
  },
  "add-circle": {
    iconset: Ionicons,
    name: "add-circle",
  },
  "remove-circle": {
    iconset: Ionicons,
    name: "remove-circle",
  },
};

export const Icon = ({
  name,
  size = 24,
  color = "black",
}: {
  name: keyof typeof iconList;
  size?: number;
  color?: string;
}) => {
  const BaseIcon = iconList[name].iconset;
  return <BaseIcon name={name} size={size} color={color} />;
};
