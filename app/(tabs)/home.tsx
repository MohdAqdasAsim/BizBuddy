import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, View } from "react-native";
import { useRouter } from "expo-router";
import Dashboard from "@/components/Dashboard";
// import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export default function home() {
  const router = useRouter();

  // useEffect(() => {
  //   // Set up notification channel for Android devices
  //   if (Platform.OS === "android") {
  //     Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250], // Vibration pattern for notifications
  //     });
  //   }

  //   // Handle received notifications
  //   const notificationReceivedSubscription = Notifications.addNotificationReceivedListener(
  //     (notification) => {
  //       // Handle notification here, e.g., update state or show a message
  //       console.log("Notification received:", notification);
  //     }
  //   );

  //   // Handle notification response (user interaction with notification)
  //   const notificationResponseSubscription =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       // Handle notification response here, e.g., navigate to a screen
  //       console.log("Notification response:", response);
  //     });

  //   // Clean up subscriptions on component unmount
  //   return () => {
  //     notificationReceivedSubscription.remove();
  //     notificationResponseSubscription.remove();
  //   };
  // }, []);
  

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <View className="flex-1 gap-4 flex-col m-4">
        <Dashboard />
      </View>
      {/* Adjust StatusBar style as per your app design */}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}