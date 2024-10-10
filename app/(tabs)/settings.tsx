import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import React from "react";
import { getAllCustomers } from "@/data/customers-data";
import { useAlert } from "@/contexts/AlertContext";
import { userData } from "@/data/user-data";
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";

const Btn = (alert: "warning" | "error" | "success") => {
  const { showAlert } = useAlert();
  return (
    <TouchableOpacity
      key={alert}
      onPress={() => {
        showAlert(alert.toLocaleUpperCase(), alert);
      }}
      className="bg-accent-light-orange p-3 rounded"
    >
      <Text className="text-white text-lg">{alert.toLocaleUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const options = [
  {
    icon: <AntDesign name="database" size={24} color={Colors.BACKGROUND_DARK} />,
    name: 'Import/Export',
    subtext: 'Data and others',
    path: '/pages/miscpages/UserDataUpdatePage',
  },
  {
    icon: <Ionicons name="globe-outline" size={24} color={Colors.BACKGROUND_DARK} />,
    name: 'App Language',
    subtext: 'English (devices language)',
    path: 'HomePage',
  },
  {
    icon: <MaterialIcons name="help-outline" size={24} color={Colors.BACKGROUND_DARK} />,
    name: 'Help',
    subtext: 'Help center, Cotact us',
    path: 'ProfilePage',
  },
  {
    icon: <FontAwesome5 name="users" size={24} color={Colors.BACKGROUND_DARK} />,
    name: 'Invite a friend',
    subtext: 'Help us grow',
    path: 'SettingsPage',
  },
];

const settings = () => {
  const router = useRouter();
  const profilePictureSource = userData.profilePicture
    ? { uri: userData.profilePicture }
    : require("@/assets/images/app-logo.png");
  // const exportCustomerData = async () => {
  //   const customerData = await getAllCustomers();
  //   Alert.alert("Data", JSON.stringify(customerData));
  // };

  // const alertLevels = ["error", "warning", "success"];

  // return (
  //   <View className="flex-1 justify-center items-center p-4">
  //     <TouchableOpacity
  //       onPress={exportCustomerData}
  //       className="bg-accent-light-orange p-3 rounded"
  //     >
  //       <Text className="text-white text-lg" onPress={exportCustomerData}>
  //         Export
  //       </Text>
  //     </TouchableOpacity>
  //     <View className="flex-row gap-1 mt-2">
  //       {alertLevels.map((level) =>
  //         Btn(level as "warning" | "error" | "success")
  //       )}
  //     </View>
  //   </View>
  // );
  return (
    <View className="flex-1 justify-start items-center">
      <TouchableOpacity
        activeOpacity={0.8}
        className="h-28 w-full justify-center items-center flex-row p-4 border-b-gray-200 border-b-2"
        onPress={() => router.push("/pages/miscpages/UserDataUpdatePage" as any)}
      >
        <Image
          source={profilePictureSource}
          className="w-16 h-16 rounded-full"
        />
        <View className="flex-1 h-full justify-center px-4">
          <Text className="font-heartful text-[28px] text-button-primary">
            {userData.name}
          </Text>
          <Text className="font-heartful text-[16px] opacity-70 text-button-primary">
            {userData.email}
          </Text>
        </View>
      </TouchableOpacity>
      <View className="h-28 w-full justify-start items-center p-4">
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            className="h-16 w-full flex-row items-center p-4"
            onPress={() => console.log(`Navigating to ${item.path}`)}
          >
            {item.icon}
            <View className="flex-1 h-full justify-center px-4">
              <Text className="font-heartful text-[18px] text-button-primary">
                {item.name}
              </Text>
              <Text className="font-heartful text-[12px] opacity-70 text-button-primary">
                {item.subtext}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default settings;
