import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import * as NavigationBar from "expo-navigation-bar";
import { TabBar } from "@/components/TabBar";
import Menu from "@/components/Menu";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";

export default function TabLayout() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);

  // useEffect(() => {
  //   const hideNavigationBar = async () => {
  //     await NavigationBar.setVisibilityAsync("hidden");
  //   };
  //   hideNavigationBar();

  //   return () => {
  //     const showNavigationBar = async () => {
  //       await NavigationBar.setVisibilityAsync("visible");
  //     };
  //     showNavigationBar();
  //   };
  // }, []);

  // if (Platform.OS === 'android') {
  //   StatusBar.setHidden(true);
  // }

  const handleGesture = (event: PanGestureHandlerGestureEvent) => {
    const { translationX } = event.nativeEvent;

    if (translationX > 50) {
      setMenuVisible(true);
    }
  };

  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={() => setMenuVisible(true)}
      className="ml-4"
    >
      <MaterialCommunityIcons name="menu" size={24} color={Colors.WHITE} />
    </TouchableOpacity>
  );

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => router.push("/pages/miscpages/NotificaionPage")}
      className="mr-4"
    >
      <Ionicons name="notifications-circle-outline" size={24} color={Colors.WHITE} />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <PanGestureHandler onGestureEvent={handleGesture}>
        <View className="flex-1">
          <Tabs
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
              headerStyle: { backgroundColor: Colors.PRIMARY_BLUE_SHADES.DARKEST },
              headerTitleAlign: "left",
              headerTintColor: Colors.WHITE,
              headerShown: true,
              headerLeft: renderHeaderLeft,
              headerRight: renderHeaderRight,
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                title: "BizInsight",
                headerTitleStyle: {
                  fontFamily: "Heartful",
                  fontSize: 24,
                },
              }}
            />
            <Tabs.Screen
              name="transactions"
              options={{
                title: "Transactions",
                headerTitleStyle: {
                  fontFamily: "Heartful",
                  fontSize: 24,
                },
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: "Settings",
                headerTitleStyle: {
                  fontFamily: "Heartful",
                  fontSize: 24,
                },
              }}
            />
          </Tabs>
          <Menu isVisible={isMenuVisible} onClose={() => setMenuVisible(false)} />
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}