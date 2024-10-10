import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { userData } from "@/data/user-data";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");


const MenuItemsArray = [
  {
    id: 1,
    routePath: "/",
    iconName: "home",
    label: "Home",
  },
  {
    id: 2,
    routePath: "/pages/listpages/ProductsListPages",
    iconName: "shopping",
    label: "Products",
  },
  {
    id: 3,
    routePath: "/pages/listpages/BillingsListPage",
    iconName: "bank",
    label: "Banking",
  },
  {
    id: 4,
    routePath: "/settings",
    iconName: "cog",
    label: "Settings",
  },
  {
    id: 5,
    routePath: "/reports",
    iconName: "chart-line",
    label: "Reports",
  },
  {
    id: 6,
    routePath: "/reports",
    iconName: "chart-line",
    label: "Invite",
  },
];

interface MenuItemProps {
  onClose: () => void;
  routePath: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  isActive: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  onClose,
  routePath,
  iconName,
  label,
  isActive,
}) => {
  const router = useRouter();

  const handleOptionPress = (page: string) => {
  router.push(page as any); // Temporarily casting to `any` if unsure
  onClose();
  };

  return (
    <TouchableOpacity
      onPress={() => handleOptionPress(routePath)}
      activeOpacity={0.8}
    >
      <View className="w-full h-12 items-center justify-start flex-row gap-2">
        <MaterialCommunityIcons
          name={iconName}
          size={26}
          color={Colors.BUTTON_SECONDARY_TEXT}
        />
        <Text className="font-heartful text-[18px] text-button-secondary-text">
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface MenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isVisible, onClose }) => {
  const [activeRoute, setActiveRoute] = useState<string>("/");
  const translateX = useSharedValue(-width);
  const router = useRouter();

  useEffect(() => {
    translateX.value = withSpring(isVisible ? 0 : -width, {
      damping: 15,
      stiffness: 100,
    });
  }, [isVisible]);

  useEffect(() => {
    const handleBackPress = () => {
      if (isVisible) {
        onClose();
        return true; // Prevent default back action
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleGesture = (event: PanGestureHandlerGestureEvent) => {
    const { translationX } = event.nativeEvent;

    if (translationX > 50) {
      runOnJS(onClose)();
    }
  };

  const handleOverlayPress = () => {
    if (isVisible) {
      onClose();
    }
  };

  const profilePictureSource = userData.profilePicture
    ? { uri: userData.profilePicture }
    : require("@/assets/images/app-logo.png");

  return (
    <>
      {isVisible && (
        <View
          className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-[999]"
          onTouchStart={handleOverlayPress}
        />
      )}
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View
          className="absolute top-0 bottom-0 left-0 w-[75vw] bg-white z-[1000]"
          style={animatedStyle}
        >
          <View className="flex-1 p-4">
            <View className="w-full h-[27%] gap-2 border-b-2 border-[#2c3b675e] justify-center">
              <Image
                source={profilePictureSource}
                className="w-24 h-24 rounded-full"
              />
              <View className="justify-center items-start">
                <Text className="font-heartful text-[24px] text-button-secondary-text">
                  {userData.name}
                </Text>
                <Text className="font-heartful text-[16px] opacity-70 text-button-secondary-text">
                  {userData.email}
                </Text>
              </View>
            </View>
            <View className="w-full h-3/4 p-2">
              {MenuItemsArray.map((menuItem) => (
                <MenuItem
                  key={menuItem.id}
                  iconName={menuItem.iconName as keyof typeof MaterialCommunityIcons.glyphMap}
                  routePath={menuItem.routePath}
                  label={menuItem.label}
                  onClose={() => {
                    onClose();
                    setActiveRoute(menuItem.routePath);
                  }}
                  isActive={activeRoute === menuItem.routePath}
                />
              ))}
            </View>
          </View>
          <StatusBar style="dark" />
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

export default Menu;
