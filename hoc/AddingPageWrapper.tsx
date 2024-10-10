import React, { useEffect, useCallback } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const AddingPageWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  routePath:string,
) => {
  return (props: any) => {
    const router = useRouter();
    const navigation = useNavigation();

    const renderHeaderLeft = useCallback(
      () => (
        <TouchableOpacity onPress={() => router.push(routePath as any)} style={{ padding: 8 }}>
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
          backgroundColor: Colors.PRIMARY_BLUE_SHADES.DARKEST,
          elevation: 0, // Removes shadow on Android
          shadowOpacity: 0, // Removes shadow on iOS
        },
        headerTintColor: Colors.WHITE,
        headerShadowVisible:false,
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

export default AddingPageWrapper;

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
