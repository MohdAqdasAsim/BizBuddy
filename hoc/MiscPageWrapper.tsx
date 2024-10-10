import React, { useEffect, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const MiscPageWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  title: string,
  routePath: string
): React.FC<P> => {
  return (props: any) => {
    const router = useRouter();
    const navigation = useNavigation();

    const renderHeaderLeft = useCallback(
      () => (
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
      ),
      [router]
    );

    useEffect(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: Colors.BACKGROUND_DARK,
        },
        headerTitleAlign: "center",
        headerTitle: title,
        headerTitleStyle: {
          color: Colors.WHITE,
          fontFamily: "Heartful",
          fontSize: 24,
        },
        headerTintColor: Colors.WHITE,
        headerLeft: renderHeaderLeft,
      });
    }, [navigation, renderHeaderLeft]);

    return (
      <View style={{ flex: 1 }}>
        <WrappedComponent {...props} />
        <StatusBar style="light" />
      </View>
    );
  };
};

export default MiscPageWrapper;
