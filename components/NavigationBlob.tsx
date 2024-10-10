import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface NavigationBlobProps {
  name: string;
  navigationPath: string;
  iconName: string;
  iconColor: string;
  iconSize: number;
}

const NavigationBlob: React.FC<NavigationBlobProps> = ({
  name,
  navigationPath,
  iconName,
  iconSize,
  iconColor,
}) => {
  const router = useRouter();
  return (
    <View className="h-[90%] flex-1 p-2">
      <View className="w-full h-[70%] bg-primary-orange-shades-medium-light rounded-2xl">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(navigationPath as any)}
          className="w-full h-full items-center justify-center"
        >
          <MaterialCommunityIcons
            name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
            size={iconSize}
            color={iconColor}
          />
        </TouchableOpacity>
      </View>
      <Text className="text-[13px] font-heartful text-center mt-1 text-primary-blue-shades-deepest">
        {name}
      </Text>
    </View>
  );
};

export default NavigationBlob;
