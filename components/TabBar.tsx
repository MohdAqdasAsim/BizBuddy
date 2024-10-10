import { View, Pressable, LayoutChangeEvent, GestureResponderEvent } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect, useState } from "react";
import Colors from "@/constants/Colors";

// Define the valid icon names
type IconName = 'home' | 'transactions' | 'settings';

// Define the icon mapping
const icon: Record<IconName, (props: any) => React.JSX.Element> = {
  home: (props: any) => <FontAwesome name="home" size={24} {...props} />,
  transactions: (props: any) => (
    <FontAwesome6 name="money-bill-transfer" size={24} {...props} />
  ),
  settings: (props: any) => <Feather name="settings" size={24} {...props} />,
};

// Define the TabBar component
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View
      onLayout={onTabbarLayout}
      className="absolute bottom-4 flex-row justify-between items-center bg-primary-blue-shades-darkest mx-12 h-16 w-3/4 rounded-full shadow-md"
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            height: dimensions.height - 15,
            width: buttonWidth - 30,
            backgroundColor: Colors.PRIMARY_ORANGE_SHADES.MEDIUM_LIGHT,
          },
        ]}
        className="absolute rounded-full mx-4"
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        // Ensure that label is a string
        const labelString =
          typeof label === 'string'
            ? label
            : typeof label === 'function'
            ? (label({
                focused: state.index === index,
                color: Colors.WHITE,
                position: "beside-icon", // Use valid LabelPosition here
                children: '',
              }) as string)
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: 1500,
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name as IconName}
            color={isFocused ? Colors.WHITE : Colors.PRIMARY_BLUE}
            label={labelString}
          />
        );
      })}
    </View>
  );
}

// Define the TabBarButtonProps interface with a specific IconName type for routeName
interface TabBarButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  routeName: IconName;
  color: string;
  label: string;
}

// Define the TabBarButton component
function TabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: TabBarButtonProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const topValue = interpolate(scale.value, [0, 1], [0, 9]);

    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top: topValue,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center p-2"
    >
      <Animated.View style={animatedIconStyle}>
        {icon[routeName]({
          color: Colors.WHITE,
        })}
      </Animated.View>
      <Animated.Text
        style={[{ color: Colors.WHITE }, animatedTextStyle]}
        className="font-heartful mt-1"
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}
