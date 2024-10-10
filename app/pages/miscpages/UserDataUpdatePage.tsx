import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { useNavigation, useRouter } from "expo-router";
import { userData, updateUserData } from "@/data/user-data";
import {
  Entypo,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useImagePicker } from "@/hooks/useImagePicker";
import Modal from "react-native-modal"; // Import the modal library

const UserDataUpdatePage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { pickImage, profilePicture } = useImagePicker();

  // States for editable fields
  const [name, setName] = useState(userData.name);
  const [companyName, setCompanyName] = useState(userData.companyName);
  const [email, setEmail] = useState(userData.email);

  // Modal control states
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<
    "name" | "companyName" | "email" | null
  >(null);

  const [inputValue, setInputValue] = useState("");

  const profilePictureSource = profilePicture
    ? { uri: profilePicture }
    : userData.profilePicture
    ? { uri: userData.profilePicture }
    : require("@/assets/images/app-logo.png");

  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={() => router.push("/home")}
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
      headerTitle: "Profile",
      headerTitleStyle: {
        color: Colors.WHITE,
        fontFamily: "Heartful",
        fontSize: 24,
      },
      headerStyle: {
        backgroundColor: Colors.PRIMARY_BLUE_SHADES.DARKEST,
        elevation: 0, // Removes shadow on Android
        shadowOpacity: 0, // Removes shadow on iOS
      },
      headerLeft: renderHeaderLeft,
      headerTintColor: Colors.WHITE,
      headerShadowVisible: false,
    });
  }, [navigation]);

  const handleProfilePicturePress = async () => {
    const newProfilePicture = await pickImage();
    if (newProfilePicture) {
      updateUserData({ profilePicture: newProfilePicture });
    }
  };

  const openModal = (field: "name" | "companyName" | "email") => {
    setCurrentField(field);
    setInputValue(
      field === "name" ? name : field === "companyName" ? companyName : email
    );
    setModalVisible(true);
  };

  const handleSave = () => {
    if (currentField === "name") {
      setName(inputValue);
      updateUserData({ name: inputValue });
    } else if (currentField === "companyName") {
      setCompanyName(inputValue);
      updateUserData({ companyName: inputValue });
    } else if (currentField === "email") {
      setEmail(inputValue);
      updateUserData({ email: inputValue });
    }
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <View className="bg-primary-blue-shades-darkest flex-1">
      <View className="w-full h-2/5 items-center justify-center">
        <TouchableOpacity
          className="relative items-center justify-center"
          activeOpacity={0.7}
          onPress={handleProfilePicturePress}
        >
          <Image
            source={profilePictureSource}
            className="w-36 h-36 rounded-full"
          />
          <View className="w-12 h-12 items-center justify-center bg-accent-light-orange rounded-full absolute top-24 left-24 shadow-lg">
            <Feather name="camera" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <View className="w-full flex-1 items-center justify-start">
        {/* Name */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="w-full flex-row items-center pl-4"
          onPress={() => openModal("name")}
        >
          <FontAwesome name="user-o" size={24} color="white" />
          <View className="flex-1 h-full border-b-2 border-primary-blue-shades-darker ml-4 pb-2">
            <Text className="text-white font-heartful text-[16px] opacity-60">
              Name
            </Text>
            <View className="h-8 justify-between flex-row pr-4">
              <Text className="text-white font-heartful text-[20px]">
                {name}
              </Text>
              <MaterialCommunityIcons name="pencil" size={24} color="white" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Company Name */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="w-full flex-row items-center pl-4 mt-4"
          onPress={() => openModal("companyName")}
        >
          <FontAwesome name="building-o" size={24} color="white" />
          <View className="flex-1 h-full border-b-2 border-primary-blue-shades-darker ml-4 pb-2">
            <Text className="text-white font-heartful text-[16px] opacity-60">
              Company Name
            </Text>
            <View className="h-8 justify-between flex-row pr-4">
              <Text className="text-white font-heartful text-[20px]">
                {companyName}
              </Text>
              <MaterialCommunityIcons name="pencil" size={24} color="white" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="w-full flex-row items-center pl-4 mt-4"
          onPress={() => openModal("email")}
        >
          <Entypo name="email" size={24} color="white" />
          <View className="flex-1 h-full border-b-2 border-primary-blue-shades-darker ml-4 pb-2">
            <Text className="text-white font-heartful text-[16px] opacity-60">
              Email
            </Text>
            <View className="h-8 justify-between flex-row pr-4">
              <Text className="text-white font-heartful text-[20px]">
                {email}
              </Text>
              <MaterialCommunityIcons name="pencil" size={24} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal for editing fields */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleCancel}
        onSwipeComplete={handleCancel}
        swipeDirection="down"
        backdropOpacity={0.5}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-primary-blue-shades-darkest p-4 rounded-t-lg">
          <View className="w-full">
            <Text className="font-heartful text-[18px] text-white">
              Enter your{" "}
              {currentField == "companyName" ? "company name" : currentField}
            </Text>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
              className="text-white font-heartful text-[20px] border-b-2 border-accent-light-orange mt-2 mb-4"
              placeholder={`Enter your ${
                currentField == "companyName" ? "company name" : currentField
              }`}
            />
          </View>
          <View className="flex-row justify-end">
            <TouchableOpacity onPress={handleCancel} className="mr-4 p-2">
              <Text className="text-accent-light-orange font-heartful text-[20px]">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} className="p-2">
              <Text className="text-accent-light-orange font-heartful text-[20px]">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="light" />
    </View>
  );
};

export default UserDataUpdatePage;
