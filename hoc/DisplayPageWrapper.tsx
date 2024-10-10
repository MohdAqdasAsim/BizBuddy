import { TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRouter } from "expo-router";
import {
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const DisplayPageWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  routePath:string
): React.FC<P> => {
  return (props: any) => {
    const router = useRouter();
    const navigation = useNavigation();

    const renderHeaderLeft = () => (
      <TouchableOpacity
      onPress={() => router.push(routePath as any)}
        style={{ padding: 8 }}
      >
        <MaterialIcons
          name="keyboard-arrow-left"
          size={24}
          color={Colors.WHITE}
        />
      </TouchableOpacity>
    );

    useEffect(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: Colors.PRIMARY_BLUE_SHADES.DARKEST,
          elevation: 0, // Removes shadow on Android
          shadowOpacity: 0, // Removes shadow on iOS
        },
        headerTitleStyle: {
          color: Colors.WHITE,
          fontFamily: "Heartful",
          fontSize: 24,
        },
        headerTintColor: Colors.WHITE,
        headerShadowVisible:false,
        headerLeft: renderHeaderLeft,
      });
    }, [navigation]);

    return (
      <View className="flex-1">
        <WrappedComponent {...props} />
        <StatusBar style="light" />
      </View>
    );
  };
};

export default DisplayPageWrapper;
