import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface MobileNumbers {
  phoneNumber: string;
  tag: string;
}

interface SocialLinks {
  url: string;
  platform: string;
}

interface DetailsDisplayPartProps {
  name: string;
  companyName: string;
  customerType: string;
  address: string;
  email: string;
  phoneNumberArray: MobileNumbers[];
  socialLinksArray: SocialLinks[];
  handleCallPress: (phoneNumber: string) => void;
  handleEmailPress: () => void;
  handleLocationPress: () => void;
}

const DetailsDisplayPart: React.FC<DetailsDisplayPartProps> = ({
  name,
  companyName,
  customerType,
  address,
  email,
  phoneNumberArray,
  socialLinksArray,
  handleCallPress,
  handleEmailPress,
  handleLocationPress,
}) => {
  const [isCallModalVisible, setCallModalVisible] = useState(false);
  const [isMessageModalVisible, setMessageModalVisible] = useState(false);

  const phoneNumbers =
    phoneNumberArray
      ?.filter((m) => m.phoneNumber && m.phoneNumber.trim() !== "")
      .map((m) => ({
        label: m.tag,
        value: m.phoneNumber,
      })) || [];

  const socialLinks =
    socialLinksArray
      ?.filter((m) => m.platform && m.platform.trim() !== "")
      .map((m) => ({
        platform: m.platform,
        url: m.url,
      })) || [];

  const cleanName = (name: string) => {
    // Remove extra characters like brackets or quotes
    return name.replace(/[\[\]"]+/g, "").trim();
  };

  const handleAddressPress = (address:string) => {
    const url = `geo:0,0?q=${encodeURIComponent(typeof address === "string")}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open maps");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  // Map of platform names to icons
  const platformIcons: Record<string, JSX.Element> = {
    facebook: <FontAwesome6 name="facebook-f" size={18} color={Colors.WHITE} />,
    twitter: <FontAwesome6 name="twitter" size={18} color={Colors.WHITE} />,
    instagram: <FontAwesome6 name="instagram" size={18} color={Colors.WHITE} />,
    linkedin: <FontAwesome6 name="linkedin" size={18} color={Colors.WHITE} />,
    github: <FontAwesome6 name="github" size={18} color={Colors.WHITE} />,
    youtube: <FontAwesome6 name="youtube" size={18} color={Colors.WHITE} />,
    whatsapp: <FontAwesome6 name="whatsapp" size={18} color={Colors.WHITE} />,
    snapchat: <FontAwesome6 name="snapchat" size={18} color={Colors.WHITE} />,
    pinterest: <FontAwesome6 name="pinterest" size={18} color={Colors.WHITE} />,
    telegram: <FontAwesome6 name="telegram" size={18} color={Colors.WHITE} />,
    mail: <MaterialIcons name="mail-outline" size={18} color={Colors.WHITE} />,
    phone: <MaterialIcons name="phone" size={18} color={Colors.WHITE} />,
    location: (
      <Ionicons name="location-outline" size={18} color={Colors.WHITE} />
    ),
    settings: <Octicons name="gear" size={18} color={Colors.WHITE} />,
    default: <Entypo name="link" size={18} color={Colors.WHITE} />,
  };

  const getPlatformIcon = (platform: string) => {
    const cleanPlatform = cleanName(platform).toLowerCase();
    return platformIcons[cleanPlatform] || platformIcons.default;
  };

  const handleMessagePress = (phoneNumber: string) => {
    const url = `sms:${phoneNumber}`; // Create the SMS URL
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url); // Open the SMS app
        } else {
          Alert.alert("Error", "Unable to open messaging app");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleSingleEmailPress = () => {
    const url = `mailto:${email}`; // Create the email URL
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url); // Open the email app
        } else {
          Alert.alert("Error", "Unable to open email app");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleUrlPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View className="w-11/12 items-center justify-center gap-2 mt-2">
        <View className="w-full p-4 rounded-lg shadow-sm shadow-white bg-primary-orange-shades-medium-light">
          <Text className="font-heartful text-[24px] text-white mb-2">
            Contact Info
          </Text>
          {phoneNumbers.length > 0 ? (
            phoneNumbers.map((phoneNumber, index) => (
              <View className="w-full h-8 flex-1 flex-row" key={index}>
                <View className="w-1/2 h-8 flex-1 flex-row items-center gap-2">
                  <Text className="items-center font-heartful text-white text-[18px]">
                    {phoneNumber.label}
                  </Text>
                  {phoneNumber.label === "" ? (
                    <></>
                  ) : (
                    <Entypo name="circle" size={6} color={Colors.WHITE} />
                  )}
                  <Text className="items-center font-heartful text-white text-[18px]">
                    {phoneNumber.value}
                  </Text>
                </View>

                <View className="w-1/3 h-8 flex-row items-center justify-end gap-2">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleCallPress(phoneNumber.value)}
                  >
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color={Colors.WHITE}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleMessagePress(phoneNumber.value)}
                  >
                    <MaterialIcons
                      name="message"
                      size={20}
                      color={Colors.WHITE}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text className="font-heartful text-white text-[18px] mb-2 opacity-60">
              No phone numbers available
            </Text>
          )}

          <View className="w-full mb-2 border-t-2 border-white pt-1">
            <TouchableOpacity
              onPress={
                email === "Unknown" ? () => null : handleSingleEmailPress
              }
              activeOpacity={0.7}
              className="w-full gap-2 items-center justify-between flex-row"
            >
              {email === "Unknown" ? (
                <Text className="font-heartful text-[18px] text-white opacity-60">
                  No email saved
                </Text>
              ) : (
                <Text className="font-heartful text-[18px] text-white">
                  {email}
                </Text>
              )}

              {email === "Unknown" ? (
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color={Colors.PRIMARY_ORANGE_SHADES.LIGHT}
                />
              ) : (
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color={Colors.WHITE}
                />
              )}
            </TouchableOpacity>
          </View>

          <View className="w-full mb-2 border-t-2 border-white pt-1">
            <TouchableOpacity
              onPress={address === "Unknown" ? () => null :()=> handleAddressPress(address)}
              activeOpacity={0.7}
              className="w-full gap-2 items-center justify-between flex-row"
            >
              {address === "Unknown" ? (
                <Text className="font-heartful text-[18px] text-white opacity-60">
                  No address saved
                </Text>
              ) : (
                <Text className="font-heartful text-[18px] text-white">
                  {address}
                </Text>
              )}

              {address === "Unknown" ? (
                <Entypo
                  name="address"
                  size={20}
                  color={Colors.PRIMARY_ORANGE_SHADES.LIGHT}
                />
              ) : (
                <Entypo name="address" size={20} color={Colors.WHITE} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          className={`w-full p-4 rounded-lg shadow-sm shadow-regal-blue bg-primary-orange-shades-medium-light ${
            socialLinks.length == 0 ? "hidden" : "flex"
          }`}
        >
          <Text className="font-heartful text-[24px] text-white mb-2">
            Social Links
          </Text>
          {socialLinks.length === 1 &&
          socialLinks[0].platform === "[]" &&
          socialLinks[0].url === "" ? (
            <Text className="font-heartful text-white text-[18px] opacity-60">
              No social links available
            </Text>
          ) : socialLinks.length > 0 ? (
            socialLinks.map((socialLink, index) => (
              <View className="w-full h-8 flex-1 flex-row" key={index}>
                <View className="w-1/2 h-8 flex-1 flex-row items-center gap-2">
                  {socialLink.platform === "" ? (
                    <></>
                  ) : (
                    getPlatformIcon(cleanName(socialLink.platform))
                  )}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      handleUrlPress(socialLink.url);
                    }}
                  >
                    <Text className="items-center font-heartful text-white underline text-[18px]">
                      {cleanName(socialLink.platform) === ""
                        ? cleanName(socialLink.url)
                        : cleanName(socialLink.platform)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text className="font-heartful text-white text-[18px] opacity-60">
              No social links available
            </Text>
          )}
        </View>

        <View className="w-full h-2"></View>
      </View>
    </ScrollView>
  );
};

export default DetailsDisplayPart;
