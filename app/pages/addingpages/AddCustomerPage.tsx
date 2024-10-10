import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  getCustomerDataById,
  saveCustomerData,
  updateCustomerDataById,
} from "@/data/customers-data";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AddingPageWrapper from "@/hoc/AddingPageWrapper";
import Colors from "@/constants/Colors";

const AddCustomerPage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { userId } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobileNumbers, setMobileNumbers] = useState<
    { number: string; tag: string }[]
  >([{ number: "", tag: "" }]);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [customerType, setCustomerType] = useState<"business" | "individual">(
    "individual"
  );
  const [socialLinks, setSocialLinks] = useState<
    { platform: string; url: string }[]
  >([{ platform: "", url: "" }]);

  const nameRef = useRef(name);
  const companyNameRef = useRef(companyName);
  const addressRef = useRef(address);
  const emailRef = useRef(email);
  const customerTypeRef = useRef(customerType);
  const mobileNumbersRef = useRef(mobileNumbers);
  const socialLinksRef = useRef(socialLinks);

  const handleSaveButton = async () => {
    console.log("Name:", nameRef.current);
    console.log("Company Name:", companyNameRef.current);
    console.log("Address:", addressRef.current);
    console.log("Email:", mobileNumbers);

    if (!userId && !nameRef.current.trim()) {
      Alert.alert("Name cannot be empty");
      return;
    }
    const customerData = {
      name: nameRef.current,
      companyName: companyNameRef.current, // Update this line
      mobileNumbers: mobileNumbersRef.current,
      address: addressRef.current, // Update this line
      email: emailRef.current, // Update this line
      customerType: customerTypeRef.current,
      socialLinks: socialLinksRef.current,
    };
    console.log("Customer Data:", customerData);

    if (userId) {
      updateCustomerDataById(userId as string, customerData);
    } else {
      await saveCustomerData(customerData);
    }
    console.log("Customer Data:", customerData);
    setName("");
    setCompanyName("");
    setMobileNumbers([{ number: "", tag: "" }]);
    setAddress("");
    setEmail("");
    setCustomerType("individual");
    setSocialLinks([{ platform: "", url: "" }]);
    router.push("/pages/listpages/CustomersListPage");
  };

  const handleMobileNumberChange = (
    index: number,
    value: string,
    field: "number" | "tag"
  ) => {
    const updatedMobileNumbers = [...mobileNumbers];
    updatedMobileNumbers[index][field] = value;

    if (
      field === "number" &&
      value.trim() &&
      index === mobileNumbers.length - 1
    ) {
      setMobileNumbers([...updatedMobileNumbers, { number: "", tag: "" }]);
      mobileNumbersRef.current = [
        ...updatedMobileNumbers,
        { number: "", tag: "" },
      ];
    } else {
      setMobileNumbers(updatedMobileNumbers);
      mobileNumbersRef.current = [...updatedMobileNumbers];
    }
  };

  const addMobileNumberField = () => {
    setMobileNumbers([...mobileNumbers, { number: "", tag: "" }]);
  };

  const removeMobileNumberField = (index: number) => {
    if (mobileNumbers.length > 1) {
      const updatedMobileNumbers = mobileNumbers.filter((_, i) => i !== index);
      setMobileNumbers(updatedMobileNumbers);
    }
  };

  const handleSocialLinkChange = (
    index: number,
    value: string,
    field: "platform" | "url"
  ) => {
    const updatedSocialLinks = [...socialLinks];
    updatedSocialLinks[index][field] = value;

    // Check if url field is not empty and if it's the last item in the list
    if (field === "url" && value.trim() && index === socialLinks.length - 1) {
      setSocialLinks([...updatedSocialLinks, { platform: "", url: "" }]);
      socialLinksRef.current = [
        ...updatedSocialLinks,
        { platform: "", url: "" },
      ];
    } else {
      setSocialLinks(updatedSocialLinks);
      socialLinksRef.current = [...updatedSocialLinks];
    }
  };

  const addSocialLinkField = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const removeSocialLinkField = (index: number) => {
    if (socialLinks.length > 1) {
      const updatedSocialLinks = socialLinks.filter((_, i) => i !== index);
      setSocialLinks(updatedSocialLinks);
    }
  };

  // Determine the logo based on customerType
  const LogoCircle = () => {
    return customerType === "individual" ? (
      <MaterialCommunityIcons name="account" size={32} color={Colors.WHITE} />
    ) : (
      <Ionicons name="business" size={32} color={Colors.WHITE} />
    );
  };

  // Toggle customer type
  const toggleCustomerType = () => {
    setCustomerType((prevType) =>
      prevType === "individual" ? "business" : "individual"
    );
    customerTypeRef.current =
      customerType === "individual" ? "business" : "individual";
  };

  const renderHeaderRight = () => (
    <TouchableOpacity onPress={handleSaveButton} style={{ padding: 8 }}>
      <FontAwesome6 name="check" size={24} color={Colors.WHITE} />
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (userId) {
        const existingCustomer = await getCustomerDataById(
          userId as string
        );
        if (existingCustomer) {
          setName(existingCustomer.name ?? "");
          setCompanyName(existingCustomer.companyName ?? "");
          setEmail(existingCustomer.email ?? "");
          setAddress(existingCustomer.address ?? "");
          setMobileNumbers(
            existingCustomer.mobileNumbers ?? [{ number: "", tag: "" }]
          );
          setSocialLinks(
            existingCustomer.socialLinks ?? [{ platform: "", url: "" }]
          );
          setCustomerType(existingCustomer.customerType ?? "individual");
        }
      }
    };
    fetchCustomerData(); // Call the async function

    navigation.setOptions({
      headerRight: renderHeaderRight,
      headerTitleAlign: "center",
      headerTitle: (userId ? "Edit" : "Add") + " Customer",
      headerTitleStyle: {
        color: Colors.WHITE,
        fontFamily: "Heartful",
        fontSize: 24,
      },
    });
  }, [navigation, userId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      router.push("/pages/listpages/CustomersListPage");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View className="flex-1 bg-primary-blue-shades-light">
      <ScrollView className="w-full">
        <View className="w-full shadow-lg bg-white mt-3">
          <View className="w-full mt-4 items-center justify-center">
            <TouchableOpacity
              onPress={toggleCustomerType}
              activeOpacity={0.8}
              className="w-20 h-20 bg-primary-orange items-center justify-center rounded-full shadow-lg transform transition-transform duration-300 ease-in-out"
              style={{ transform: [{ scale: 1.05 }] }}
            >
              <LogoCircle />
            </TouchableOpacity>
          </View>

          <View className="w-full bg-white mt-4 px-2">
            <View className="w-full flex-row border-t-2 border-primary-blue-shades-light bg-white p-2 items-center justify-start">
              <Feather name="user" size={20} color={Colors.BORDER_DARK} />
              <TextInput
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  nameRef.current = value;
                }}
                className="text-[18px] opacity-70 w-full font-heartful ml-2"
                placeholder="Name"
              />
            </View>
            <View className="w-full flex-row border-t-2 border-primary-blue-shades-light bg-white p-2 items-center justify-start">
              <FontAwesome6
                name="building"
                size={20}
                color={Colors.BORDER_DARK}
              />
              <TextInput
                value={companyName}
                onChangeText={(value) => {
                  setCompanyName(value);
                  companyNameRef.current = value;
                }}
                className="text-[18px] opacity-70 w-full font-heartful ml-2"
                placeholder="Company"
              />
            </View>
            <View className="w-full flex-row border-t-2 border-primary-blue-shades-light bg-white p-2 items-center justify-start">
              <Entypo name="address" size={20} color={Colors.BORDER_DARK} />
              <TextInput
                value={address}
                onChangeText={(value) => {
                  setAddress(value);
                  addressRef.current = value;
                }}
                className="text-[18px] opacity-70 w-full font-heartful ml-2"
                placeholder="Address"
              />
            </View>
            <View className="w-full flex-row border-t-2 border-primary-blue-shades-light bg-white p-2 items-center justify-start">
              <Entypo name="email" size={20} color={Colors.BORDER_DARK} />
              <TextInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  emailRef.current = value;
                }}
                className="text-[18px] opacity-70 w-full font-heartful ml-2"
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>
          </View>
        </View>

        <View className="w-full shadow-lg bg-white mt-3">
          {mobileNumbers.map((numberObj, index) => (
            <View key={index} className="flex-row py-2">
              <View className="w-[30%] flex-row border-r-2 border-[#50c6c86e] bg-white p-2 items-center justify-start">
                <Ionicons name="call" size={20} color={Colors.BORDER_DARK} />
                <TextInput
                  value={numberObj.tag}
                  onChangeText={(value) =>
                    handleMobileNumberChange(index, value, "tag")
                  }
                  className="text-[14px] opacity-70 w-full font-heartful ml-2"
                  placeholder="Label"
                />
              </View>
              <View className="w-[50%] bg-white p-2 items-center justify-start">
                <TextInput
                  value={numberObj.number}
                  onChangeText={(value) =>
                    handleMobileNumberChange(index, value, "number")
                  }
                  className="text-[14px] opacity-70 w-full font-heartful ml-2"
                  placeholder="Mobile Number"
                  keyboardType="number-pad"
                />
              </View>
              {mobileNumbers.length > 1 &&
                index !== mobileNumbers.length - 1 && (
                  <TouchableOpacity
                    onPress={() => removeMobileNumberField(index)}
                    activeOpacity={0.7}
                    className="w-[13%] bg-white p-2 items-center justify-center"
                  >
                    <AntDesign
                      name="minuscircleo"
                      size={24}
                      color={Colors.PRIMARY_ORANGE}
                    />
                  </TouchableOpacity>
                )}
            </View>
          ))}
        </View>

        <View className="w-full shadow-lg bg-white mt-3">
          {socialLinks.map((link, index) => (
            <View key={index} className="flex-row py-2">
              <View className="w-[30%] flex-row border-r-2 border-[#50c6c86e] bg-white p-2 items-center justify-start">
                <Entypo name="link" size={20} color={Colors.BORDER_DARK} />
                <TextInput
                  value={link.platform}
                  onChangeText={(value) =>
                    handleSocialLinkChange(index, value, "platform")
                  }
                  className="text-[14px] opacity-70 w-full font-heartful ml-2"
                  placeholder="Platform"
                />
              </View>
              <View className="w-[50%] bg-white p-2 items-center justify-start">
                <TextInput
                  value={link.url}
                  onChangeText={(value) =>
                    handleSocialLinkChange(index, value, "url")
                  }
                  className="text-[14px] opacity-70 w-full font-heartful ml-2"
                  placeholder="Social URL"
                />
              </View>
              {socialLinks.length > 1 && index !== socialLinks.length - 1 && (
                <TouchableOpacity
                  onPress={() => removeSocialLinkField(index)}
                  activeOpacity={0.7}
                  className="w-[13%] bg-white p-2 items-center justify-center"
                >
                  <AntDesign
                    name="minuscircleo"
                    size={24}
                    color={Colors.PRIMARY_ORANGE}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View className="w-full shadow-lg bg-white mt-3"></View>
      </ScrollView>
    </View>
  );
};

export default AddingPageWrapper(
  AddCustomerPage,
  "/pages/listpages/CustomersListPage"
);
