// OnBoardingPage.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserData } from "@/data/user-data";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const OnBoardingPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleProfilePicturePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    updateUserData({
      name,
      companyName,
      email,
      profilePicture,
    });

    await AsyncStorage.setItem("OnBoardingPageCompleted", "true");
    router.push("/home"); // Navigate to the main screen after completion
  };

  return (
    <View className="bg-primary-blue-shades-lightest w-full h-full justify-between items-center p-4">
      <View className="w-full items-center">
        <View className="w-full h-24 items-center justify-center">
          <Text className="text-[24px] font-heartful text-primary-orange">
            Profile Info
          </Text>
        </View>
        <View className="w-full justify-start items-center">
          <Text className="text-primary-blue-shades-deepest opacity-40 text-[14px] font-heartful">
            Please provide your name and an optional profile photo
          </Text>
          <TouchableOpacity
            className="w-28 h-28 bg-gray-100 rounded-full my-4 items-center justify-center overflow-hidden"
            onPress={handleProfilePicturePick}
          >
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                className="w-full h-full"
              />
            ) : (
              <MaterialCommunityIcons
                name="camera-plus"
                size={50}
                color={Colors.PRIMARY_BLUE_SHADES.DARKER}
              />
            )}
          </TouchableOpacity>
          <TextInput
            className="w-full border-b-2 border-border-dark h-8 p-0 font-heartful text-primary-blue-shades-deepest text-[16px]"
            placeholder="Type your name here"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="w-full border-b-2 border-border-dark h-8 p-0 font-heartful text-primary-blue-shades-deepest text-[16px]"
            placeholder="Type your company name here"
            value={companyName}
            onChangeText={setCompanyName}
          />
          <TextInput
            className="w-full border-b-2 border-border-dark h-8 p-0 font-heartful text-primary-blue-shades-deepest text-[16px]"
            placeholder="Type your email address here"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        className="w-full h-9 bg-primary-orange rounded-2xl justify-center"
      >
        <Text className="font-heartful text-white text-[18px] text-center">
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnBoardingPage;
