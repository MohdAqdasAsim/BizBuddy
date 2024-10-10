import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import DisplayPageWrapper from "@/hoc/DisplayPageWrapper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import CommentsDisplayPart from "@/components/CommentsDisplayPart";
import TransactionsDisplayPart from "@/components/TransactionsDisplayPart";
import DetailsDisplayPart from "@/components/DetailsDisplayPart";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface CustomerDisplayPageProps {
  id:string;
  name: string;
  phoneNumbers: string;
  address: string;
  email: string;
  customerType: string;
  companyName: string;
  socialLinks: string;
}

const CustomerDisplayPage: React.FC<CustomerDisplayPageProps> = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [tabActive, setTabActive] = useState<
    "details" | "transactions" | "comments"
  >("details");
  const {
    id,
    name,
    phoneNumbers,
    address,
    email,
    customerType,
    companyName,
    socialLinks,
  } = useLocalSearchParams();

  const parsePhoneNumbers = (phoneNumbersString: string) => {
    const parsed = phoneNumbersString.split(",").map((item) => {
      const [number, tag] = item.split(".");
      return {
        phoneNumber: number ? number.trim() : "",
        tag: tag ? tag.trim() : "",
      };
    });
    return parsed;
  };

  const parseSocialLinks = (socialLinksString: string) => {
    const parsed = socialLinksString.split(",").map((item) => {
      const [platform, url] = item.split("^");
      return {
        url: url ? url.trim() : "",
        platform: platform ? platform.trim() : "",
      };
    });
    return parsed;
  };

  const phoneNumberArray =
    typeof phoneNumbers === "string" ? parsePhoneNumbers(phoneNumbers) : [];

  const socialLinkArray =
    typeof socialLinks === "string" ? parseSocialLinks(socialLinks) : [];

  const handleCallPress = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open dialer");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleLocationPress = () => {
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

  const handleEmailPress = () => {
    const url = `mailto:${email}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open email app");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleEditPress = (id: string) => {
    router.push(`/pages/addingpages/AddCustomerPage?userId=${id}`);
  };

  const renderHeaderRight = () => {
    return (
      <TouchableOpacity
        onPress={() => handleEditPress(id as string)}
        style={{ marginRight: 16 }}
      >
        <Feather name="edit" size={24} color={Colors.WHITE} />
      </TouchableOpacity>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: renderHeaderRight,
    });
  }, [navigation, router]);

  // Determine the logo based on customerType
  const LogoCircle = () => {
    return customerType === "individual" ? (
      <MaterialCommunityIcons name="account" size={32} color={Colors.WHITE} />
    ) : (
      <Ionicons name="business" size={32} color={Colors.WHITE} />
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      router.push("/pages/listpages/CustomersListPage");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View className="w-full h-full">
      <View
        className={`w-full h-28 flex-row items-center justify-center bg-primary-blue-shades-darkest`}
      >
        <View className="w-2/3 h-full p-8">
          <Text className="font-heartful text-[40px] text-[#ffffff]">
            {name}
          </Text>
          <Text className="font-heartful text-[18px] text-[#ffffff] opacity-75">
            {companyName === "Unknown" ? "" : companyName}
          </Text>
        </View>
        <View className="w-1/3 h-full items-center justify-center">
          <View className="w-20 h-20 rounded-full bg-primary-blue items-center shadow-2xl justify-center">
            <LogoCircle />
          </View>
        </View>
      </View>
      <View
        className={`w-full h-12 items-center justify-center flex-row bg-[${Colors.WHITE}] shadow-xl`}
      >
        <TouchableOpacity
          className={`h-full w-1/3 items-center justify-center border-primary-orange-shades-dark ${
            tabActive === "details" ? "border-b-2" : "border-b-0"
          }`}
          onPress={() => setTabActive("details")}
        >
          <Text
            className={`font-heartful text-[18px] text-primary-orange-shades-dark`}
          >
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`h-full w-1/3 items-center justify-center border-primary-orange-shades-dark ${
            tabActive === "transactions" ? "border-b-2" : "border-b-0"
          }`}
          onPress={() => setTabActive("transactions")}
        >
          <Text
            className={`font-heartful text-[18px] text-primary-orange-shades-dark`}
          >
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`h-full w-1/3 items-center justify-center border-primary-orange-shades-dark ${
            tabActive === "comments" ? "border-b-2" : "border-b-0"
          }`}
          onPress={() => setTabActive("comments")}
        >
          <Text
            className={`font-heartful text-[18px] text-primary-orange-shades-dark`}
          >
            Comments
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 bg-slate-200">
        {tabActive === "details" ? (
          <DetailsDisplayPart
            name={typeof name === "string" ? name : ""}
            companyName={typeof companyName === "string" ? companyName : ""}
            customerType={typeof customerType === "string" ? customerType : ""}
            address={typeof address === "string" ? address : ""}
            email={typeof email === "string" ? email : ""}
            phoneNumberArray={phoneNumberArray}
            socialLinksArray={socialLinkArray}
            handleCallPress={handleCallPress}
            handleEmailPress={handleEmailPress}
            handleLocationPress={handleLocationPress}
          />
        ) : tabActive === "transactions" ? (
          <TransactionsDisplayPart />
        ) : (
          <CommentsDisplayPart
            customerId={typeof id === "string" ? id : ""}
          />
        )}
      </View>
    </View>
  );
};

export default DisplayPageWrapper(CustomerDisplayPage,"/pages/listpages/CustomersListPage");
