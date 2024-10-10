import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { deleteCustomersByIds } from "@/data/customers-data";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { deleteProductById, deleteProductsByIds } from "@/data/products-data";

interface ListPageWrapperProps {
  searchQuery: string;
  deleteMode: boolean;
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
  toDeleteCustomers: string[];
  setToDeleteCustomers: React.Dispatch<React.SetStateAction<string[]>>;
}

const ListPageWrapper = (
  WrappedComponent: React.ComponentType<ListPageWrapperProps>,
  title: string
) => {
  return (props: any) => {
    const router = useRouter();
    const navigation = useNavigation();
    const [deleteMode, setDeleteMode] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchBarWidth = useState(new Animated.Value(0))[0];
    const [toDeleteCustomers, setToDeleteCustomers] = useState<string[]>([]);  
    const [isModalVisible, setIsModalVisible] = useState(false)
    
    const toDeleteCustomersRef = useRef(toDeleteCustomers);
    toDeleteCustomersRef.current = toDeleteCustomers;

    const [deleteComplete, setDeleteComplete] = useState(false);

    const confirmDelete = useCallback(async () => {
      await deleteCustomersByIds(toDeleteCustomersRef.current);
      await deleteProductsByIds(toDeleteCustomersRef.current);
      setToDeleteCustomers([]);
      setDeleteMode(false);
      setDeleteComplete(true); // Set deleteComplete to true
      setIsModalVisible(false);
    }, [toDeleteCustomers]);

    const renderHeaderLeft = useCallback(
      () => (
        <TouchableOpacity
          onPress={() => (deleteMode ? setDeleteMode(false) : router.push("/home"))}
          style={{ padding: 8 }}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={Colors.WHITE}
          />
        </TouchableOpacity>
      ),
      [router, deleteMode]
    );

    const renderHeaderRight = useCallback(
      () => (
        <View style={styles.headerRightContainer}>
          {isSearchActive && (
            <Animated.View
              style={[{ width: searchBarWidth }]}
              className={`bg-white shadow-shadow-color shadow-2xl text-white`}
            >
              <TextInput
                className="px-4 h-10 text-white"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search"
                placeholderTextColor={Colors.WHITE}
                autoFocus
                style={{ color: "#ffffff" }}
              />
            </Animated.View>
          )}
          <TouchableOpacity
            onPress={() => {
              if (deleteMode) {
                setIsModalVisible(true);
              } else {
                if (isSearchActive) {
                  Animated.timing(searchBarWidth, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: false,
                  }).start(() => {
                    setIsSearchActive(false);
                    setSearchQuery("");
                  });
                } else {
                  setIsSearchActive(true);
                  Animated.timing(searchBarWidth, {
                    toValue: 150,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: false,
                  }).start();
                }
              }
            }}
            style={{ marginRight: 16 }}
          >
            {deleteMode ? (
              <MaterialIcons
                name="delete-outline"
                size={24}
                color={Colors.WHITE}
              />
            ) : (
              <Ionicons
                name={isSearchActive ? "close" : "search"}
                size={24}
                color={Colors.WHITE}
              />
            )}
          </TouchableOpacity>
        </View>
      ),
      [isSearchActive, searchQuery, searchBarWidth, deleteMode]
    );

    useEffect(() => {
      if (deleteComplete) {
        setDeleteComplete(false); // Reset deleteComplete to false
      }
      navigation.setOptions({
        headerStyle: {
          backgroundColor: Colors.PRIMARY_BLUE_SHADES.DARKEST,
          elevation: 0, // Removes shadow on Android
          shadowOpacity: 0, // Removes shadow on iOS
        },
        headerTitleAlign: "center",
        headerTitle: isSearchActive ? "" : title,
        headerTitleStyle: {
          color: Colors.WHITE,
          fontFamily: "Heartful",
          fontSize: 24,
        },
        headerTintColor: Colors.WHITE,
        headerShadowVisible: false,
        headerLeft: renderHeaderLeft,
        headerRight: renderHeaderRight,
      });
    }, [navigation, deleteComplete, renderHeaderLeft, renderHeaderRight, isSearchActive]);

    return (
      <View style={{ flex: 1 }}>
        <WrappedComponent
          {...props}
          searchQuery={searchQuery}
          deleteMode={deleteMode}
          setDeleteMode={setDeleteMode}
          toDeleteCustomers={toDeleteCustomers}
          setToDeleteCustomers={setToDeleteCustomers}key={deleteComplete ? Date.now() : undefined}
        />
        <StatusBar style="light" />

        <DeleteConfirmationModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} confirmDelete={confirmDelete} />
      </View>
    );
  };
};

export default ListPageWrapper;

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
