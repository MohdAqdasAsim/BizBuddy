import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Linking,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import ListPageWrapper from "@/hoc/ListPageWrapper";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import {
  getAllCustomers,
  CustomerData,
  deleteCustomerById,
} from "@/data/customers-data";
import { Menu, MenuItem } from "react-native-material-menu";
import Modal from "react-native-modal";
import RNPickerSelect from "react-native-picker-select";
import Colors from "@/constants/Colors";

interface CustomersListPageProps {
  searchQuery: string;
  deleteMode: boolean;
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
  toDeleteCustomers: string[];
  setToDeleteCustomers: React.Dispatch<React.SetStateAction<string[]>>;
}

const CustomersListPage: React.FC<CustomersListPageProps> = ({
  searchQuery,
  deleteMode,
  setDeleteMode,
  toDeleteCustomers,
  setToDeleteCustomers,
}) => {
  const router = useRouter();
  const navigation = useNavigation();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [callMenuVisible, setCallMenuVisible] = useState<number | null>(null);
  const [shareMenuVisible, setShareMenuVisible] = useState<number | null>(null);
  const [messageMenuVisible, setMessageMenuVisible] = useState<number | null>(
    null
  );
  const [phoneMenuVisible, setPhoneMenuVisible] = useState<number | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [phoneNumbers, setPhoneNumbers] = useState<
    { label: string; value: string }[]
  >([]);
  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);
  const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<string | null>(null);

  const handleCheckboxPress = (customerId: string) => {
    setIsCheckBoxChecked((prevState) => !prevState);
    // Update toDeleteCustomers array to use IDs
    setToDeleteCustomers((prevArray) => {
      if (prevArray.includes(customerId)) {
        // If customer ID is already in the array, remove it
        return prevArray.filter((id) => id !== customerId);
      } else {
        // If customer ID is not in the array, add it
        return [...prevArray, customerId];
      }
    });
  };

  const handleLongPress = (index: number) => {
    setDeleteMode(true);
    setLongPressedIndex(index);
  };

  const handleCancelDelete = () => {
    setDeleteMode(false);
    setLongPressedIndex(null);
  };

  const hideCallMenu = () => setCallMenuVisible(null);
  const showCallMenu = (index: number) => setCallMenuVisible(index);

  const hideShareMenu = () => setShareMenuVisible(null);
  const showShareMenu = (index: number) => setShareMenuVisible(index);

  const hideMessageMenu = () => setMessageMenuVisible(null);
  const showMessageMenu = (index: number) => {
    const customer = customers[index];
    const numbers =
      customer.mobileNumbers
        ?.filter((m) => m.number && m.number.trim() !== "")
        .map((m) => ({
          label: `${m.tag}: ${m.number}`,
          value: m.number,
        })) || [];
    setPhoneNumbers(numbers);
    setMessageMenuVisible(index);
  };

  const hidePhoneMenu = () => setPhoneMenuVisible(null);
  const showPhoneMenu = (index: number) => {
    const customer = customers[index];
    const numbers =
      customer.mobileNumbers
        ?.filter((m) => m.number && m.number.trim() !== "")
        .map((m) => ({
          label: `${m.tag}: ${m.number}`,
          value: m.number,
        })) || [];
    setPhoneNumbers(numbers);
    setPhoneMenuVisible(index);
  };

  const fetchCustomers = async () => {
    const CustomersData = await getAllCustomers();
    console.log(CustomersData);
    
    const validCustomers = CustomersData.filter(
      (customer) => customer.name.trim() !== ""
    );
    setCustomers(validCustomers);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (index: string) => {
    hideShareMenu();
    setDeleteIndex(index);
    setIsModalVisible(true);
  };

  const handleUserDisplay = (
    id: string,
    name: string = "Unknown",
    phoneNumbers: string[] = [],
    address: string = "Unknown",
    email: string = "Unknown",
    customerType: string = "Unknown",
    companyName: string = "Unknown",
    socialLinks: string[] = []
  ) => {
    // Serialize socialLinks to a string
    const serializedSocialLinks = JSON.stringify(socialLinks);

    router.push({
      pathname: "/pages/displaypages/CustomerDisplayPage",
      params: {
        id,
        name,
        phoneNumbers,
        address,
        email,
        customerType,
        companyName,
        socialLinks: serializedSocialLinks,
      },
    });
  };

  const handleShare = async (
    name: string,
    phoneNumber: string,
    address: string,
    customerType: string,
    companyName: string
  ) => {
    try {
      await Share.share({
        message: `Name: ${name}\nPhone Number: ${phoneNumber}\nAddress: ${address}\nCustomer Type: ${customerType}\nCompany Name: ${companyName}`,
      });
    } catch (error) {
      Alert.alert("Error sharing customer");
    }
    hideShareMenu();
  };

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
    hidePhoneMenu();
  };

  const handleMessagePress = (index: number) => {
    setSelectedNumber("");
    setMessage("");
    showMessageMenu(index);
  };

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      await deleteCustomerById(deleteIndex);
      setIsModalVisible(false);
      fetchCustomers();
    }
  };

  const sendMessage = () => {
    if (!selectedNumber || !message) {
      Alert.alert("Error", "Please enter a message and select a number");
      return;
    }
    const url = `sms:${selectedNumber}?body=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open messaging app");
        }
      })
      .catch((err) => console.error("An error occurred", err));
    hideMessageMenu();
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      e.preventDefault();
      router.push("/home");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View className="flex-1 bg-primary-blue-shades-darkest relative">
      <ScrollView
        className="flex-1 bg-white rounded-t-3xl p-1 shadow-lg"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {filteredCustomers.length === 0 ? (
          <Text className="text-2xl font-heartful text-primary-blue-shades-darkest mt-4">
            No Customers available
          </Text>
        ) : (
          filteredCustomers.map((customer, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                deleteMode
                  ? handleCheckboxPress(customer.id)
                  : handleUserDisplay(
                      customer.id,
                      customer.name,
                      customer.mobileNumbers
                        ?.filter((m) => m && m.number && m.number.trim() !== "")
                        .map((m) => m.number + "." + m.tag) || [], // Only pass phone numbers
                      customer.address || "Unknown",
                      customer.email || "Unknown",
                      customer.customerType || "Unknown",
                      customer.companyName || "Unknown",
                      customer.socialLinks
                        ?.filter((m) => m && m.url && m.url.trim() !== "")
                        .map((m) => m.platform + "^" + m.url) || [] // Only pass phone numbers
                    )
              }
              onLongPress={() => handleLongPress(index)}
            >
              <View
                key={index}
                className={`mb-2 p-2 pl-3 w-11/12 bg shadow-dark-grey shadow-md rounded-lg flex-row items-center justify-between bg-primary-blue-shades-medium-light bg-opacity-50 ${
                  index === 0 ? "mt-4" : "mt-0"
                }`}
              >
                <Text className="text-[22px] font-heartful text-button-primary">
                  {customer.name}
                </Text>

                {deleteMode ? (
                  <View className="flex-row w-1/3 justify-end pr-3">
                    <AntDesign
                      name={
                        toDeleteCustomers.includes(customer.id)
                          ? "checksquare"
                          : "checksquareo"
                      }
                      size={16}
                      color={Colors.BUTTON_PRIMARY}
                    />
                  </View>
                ) : (
                  <View className="flex-row w-1/3 justify-evenly">
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => showPhoneMenu(index)}
                    >
                      <MaterialCommunityIcons
                        name="phone"
                        size={16}
                        color={Colors.BUTTON_PRIMARY}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleMessagePress(index)}
                    >
                      <MaterialCommunityIcons
                        name="message"
                        size={16}
                        color={Colors.BUTTON_PRIMARY}
                      />
                    </TouchableOpacity>

                    <Menu
                      visible={shareMenuVisible === index}
                      anchor={
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => showShareMenu(index)}
                        >
                          <MaterialCommunityIcons
                            name="dots-vertical"
                            size={16}
                            color={Colors.BUTTON_PRIMARY}
                          />
                        </TouchableOpacity>
                      }
                      onRequestClose={hideShareMenu}
                    >
                      <MenuItem onPress={() => handleDelete(customer.id)}>
                        <Text className="font-heartful text-lg text-error-red">
                          Delete
                        </Text>
                      </MenuItem>
                      <MenuItem
                        onPress={() =>
                          handleShare(
                            customer.name,
                            customer.mobileNumbers
                              ? customer.mobileNumbers[0]?.number || ""
                              : "",
                            customer.address || "",
                            customer.customerType || "",
                            customer.companyName || ""
                          )
                        }
                      >
                        <Text className="font-heartful text-lg text-primary-blue">
                          Share
                        </Text>
                      </MenuItem>
                    </Menu>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Phone Number Modal */}
      <Modal
        isVisible={phoneMenuVisible !== null}
        onBackdropPress={hidePhoneMenu}
        onBackButtonPress={hidePhoneMenu}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View className="bg-white p-4 rounded-lg shadow-md w-80">
          <Text className="text-lg font-heartful text-primary-blue-shades-darkest mb-4">
            {phoneNumbers.length > 0
              ? "Select a phone number"
              : "No numbers saved for this contact"}
          </Text>
          {phoneNumbers.length > 0 ? (
            <>
              <RNPickerSelect
                placeholder={{ label: "Select a phone number...", value: null }}
                items={phoneNumbers}
                onValueChange={(value) => setSelectedNumber(value)}
                value={selectedNumber}
              />
              <TouchableOpacity
                onPress={handleCallPress.bind(null, selectedNumber)}
                className="mt-4 bg-primary-blue p-2 rounded-lg"
              >
                <Text className="text-white text-center font-heartful text-[18px]">
                  Call
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <></>
          )}
        </View>
      </Modal>

      {/* Message Modal */}
      <Modal
        isVisible={messageMenuVisible !== null}
        onBackdropPress={hideMessageMenu}
        onBackButtonPress={hideMessageMenu}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View className="bg-white p-4 rounded-lg shadow-md w-80">
          <Text className="text-lg font-heartful text-primary-blue-shades-darkest mb-4">
            {phoneNumbers.length > 0
              ? "Select a phone number"
              : "No numbers saved for this contact"}
          </Text>
          {phoneNumbers.length > 0 ? (
            <>
              <RNPickerSelect
                placeholder={{ label: "Select a phone number...", value: null }}
                items={phoneNumbers}
                onValueChange={(value) => setSelectedNumber(value)}
                value={selectedNumber}
              />
              <TextInput
                placeholder="Enter your message here..."
                value={message}
                onChangeText={setMessage}
                className="border border-primary-blue-shades-darkest p-2 rounded-lg mt-2"
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity
                onPress={sendMessage}
                className="mt-4 bg-primary-blue p-2 rounded-lg"
              >
                <Text className="text-white text-center font-heartful text-[18px]">
                  Send Message
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <></>
          )}
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onBackButtonPress={() => setIsModalVisible(false)}
      >
        <View className="bg-red-50 p-4 rounded-lg shadow-lg">
          <Text className="text-lg font-heartful mb-2 text-red-700">
            Confirm Deletion
          </Text>
          <Text className="mb-4 font-heartful text-red-500">
            Are you sure you want to delete this customer?
          </Text>
          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              className="bg-gray-300 p-2 rounded-lg mr-2"
            >
              <Text className="text-black font-heartful">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmDelete}
              className="bg-error-red p-2 rounded-lg"
            >
              <Text className="text-white font-heartful">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View className="absolute w-full h-full justify-end items-end p-4">
        <TouchableOpacity
          className="w-16 h-16 bg-primary-blue-shades-darkest rounded-full items-center justify-center"
          activeOpacity={0.7}
          onPress={() => router.push("/pages/addingpages/AddCustomerPage")}
        >
          <MaterialCommunityIcons name="plus" size={32} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListPageWrapper(CustomersListPage, "Customers");
