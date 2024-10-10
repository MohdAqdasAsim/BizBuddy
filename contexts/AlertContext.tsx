import Colors from "@/constants/Colors";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { View, Text, StyleSheet, Modal, Animated, Easing } from "react-native";

const AlertContext = React.createContext({
  showAlert: (message: string, level: "warning" | "error" | "success") => {},
});

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [level, setLevel] = React.useState<"warning" | "error" | "success">(
    "success"
  );
  const [animation] = React.useState(new Animated.Value(0)); // For animation

  const showAlert = (msg: string, lvl: "warning" | "error" | "success") => {
    setMessage(msg);
    setLevel(lvl);
    setVisible(true);

    // Start animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      // Hide after 1.5 seconds
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 1500);
  };

  const alertBoxStyle = {
    ...styles.alertBox,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0], // Adjust translateY to move the box up from the bottom
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1], // Optional: Add a slight scale effect for popping up
        }),
      },
    ],
  };

  // Map of alert names to icons
  const alertIcons: Record<string, JSX.Element> = {
    error: <MaterialIcons name="error" size={18} color="#d5122d" />,
    warning: <Entypo name="warning" size={18} color="#ffbd08" />,
    success: <AntDesign name="checkcircle" size={18} color="#08770a" />,
  };

  const alertIcon = () => {
    return alertIcons[level] || alertIcons.success;
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {visible && (
        <Modal transparent={true} visible={visible} animationType="fade">
          <View style={styles.overlay}>
            <Animated.View style={[alertBoxStyle, styles[level]]}>
              {alertIcon()}
              <Text style={[styles.message, styles[level]]}>{message}</Text>
            </Animated.View>
          </View>
        </Modal>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255, 0.1)", // Semi-transparent background
    padding: 20, // Add padding to ensure the alert box is not stuck to the edge
  },
  alertBox: {
    width: "auto",
    height: "auto",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.5, // Adjust opacity for shadow effect
    shadowRadius: 8, // Adjust shadow radius for blur effect
    elevation: 2, // Add elevation for Android shadow effect
    backgroundColor: "#fff", // Default background color for alert box
  },
  success: {
    backgroundColor: "#d4fad6",
    color: "#08770a",
    shadowColor: "#d4fad6", // Lighter shade of the background color
  },
  warning: {
    backgroundColor: "#f5e68f",
    color: "#ffbd08",
    shadowColor: "#f5e68f", // Lighter shade of the background color
  },
  error: {
    backgroundColor: "#ffcec7",
    color: "#d5122d",
    shadowColor: "#ffcec7", // Lighter shade of the background color
  },
  message: {
    fontFamily: "Heartful",
    fontSize: 24,
  },
});
