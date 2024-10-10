import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Text,
  Modal,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  getProductDataById,
  saveProductData,
  updateProductDataById,
} from "@/data/products-data";
import {
  FontAwesome6,
  Feather,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import AddingPageWrapper from "@/hoc/AddingPageWrapper";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker"; // Import Image Picker

const AddProductPage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { productId } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState<"custom" | "complete">("complete"); // Tag state
  const [pricing, setPricing] = useState<{ fixed: number; per_size: number }>({
    fixed: 0,
    per_size: 0,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string[]>([]); // Store multiple image URLs

  const nameRef = useRef(name);
  const descriptionRef = useRef(description);
  const tagRef = useRef(tag);
  const pricingRef = useRef(pricing);
  const categoriesRef = useRef(categories);
  const imageUrlRef = useRef(imageUrl);

  // Image Picker handler
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Enables multiple image selection
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImageUrl([...imageUrl, ...selectedImages]); // Add new images
      imageUrlRef.current = [...imageUrlRef.current, ...selectedImages];
    }
  };

  const handleSaveButton = async () => {
    if (!productId && !nameRef.current.trim()) {
      Alert.alert("Product Name cannot be empty");
      return;
    }
    const productsData = {
      name: nameRef.current,
      description: descriptionRef.current,
      tag: tagRef.current,
      pricing: pricingRef.current,
      categories: categoriesRef.current,
      imageUrl: imageUrlRef.current,
    };

    if (productId) {
      updateProductDataById(productId as string, productsData);
    } else {
      await saveProductData(productsData);
    }
    setName("");
    setDescription("");
    setTag("complete");
    setPricing({ fixed: 0, per_size: 0 });
    setCategories([]);
    setImageUrl([]);
    router.push("/pages/listpages/ProductsListPage");
  };

  const renderHeaderRight = () => (
    <TouchableOpacity onPress={handleSaveButton} style={{ padding: 8 }}>
      <FontAwesome6 name="check" size={24} color={Colors.WHITE} />
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchProductData = async () => {
      if (productId) {
        const existingProduct = await getProductDataById(productId as string);
        if (existingProduct) {
          setName(existingProduct.name ?? "");
          setDescription(existingProduct.description ?? "");
          setTag(existingProduct.tag ?? "complete");
          setPricing(existingProduct.pricing as any);
          setCategories(existingProduct.categories ?? []);
          setImageUrl(existingProduct.imageUrl ?? []);
        }
      }
    };
    fetchProductData();

    navigation.setOptions({
      headerRight: renderHeaderRight,
      headerTitleAlign: "center",
      headerTitle: (productId ? "Edit" : "Add") + " Product",
      headerTitleStyle: {
        color: Colors.WHITE,
        fontFamily: "Heartful",
        fontSize: 24,
      },
    });
  }, [navigation, productId]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Function to add new category
  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      categoriesRef.current = [...categoriesRef.current, newCategory.trim()];
      setNewCategory("");
      setIsModalVisible(false);
    } else {
      Alert.alert("Category cannot be empty");
    }
  };

  // Function to remove category
  const removeCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    categoriesRef.current = updatedCategories;
  };

  return (
    <View className="flex-1 bg-primary-blue-shades-light">
      <ScrollView className="w-full">
        <View className="w-full shadow-lg bg-white mt-3">
          <View className="w-full bg-white mt-4 px-2">
            <Text className="px-2 font-heartful text-[24px] text-primary-blue-shades-darkest">
              Details
            </Text>
            <View className="w-full flex-row bg-white p-2 items-center justify-start">
              <Entypo name="dropbox" size={20} color={Colors.BORDER_DARK} />
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

            <View className="w-full flex-row bg-white p-2 items-center justify-start">
              <FontAwesome
                name="pencil-square-o"
                size={20}
                color={Colors.BORDER_DARK}
              />
              <TextInput
                value={description}
                onChangeText={(value) => {
                  setDescription(value);
                  descriptionRef.current = value;
                }}
                className="text-[18px] opacity-70 w-full font-heartful ml-2"
                placeholder="Description"
              />
            </View>

            {/* Tag Selector as Radio Buttons */}
            <View className="w-full flex-row bg-white p-2 items-center justify-start">
              <MaterialIcons
                name="merge-type"
                size={24}
                color={Colors.BORDER_DARK}
              />
              <Text className="text-[18px] opacity-70 font-heartful text-border-dark ml-2">
                Select Type:
              </Text>

              {/* Radio Button for 'Complete' */}
              <TouchableOpacity
                onPress={() => setTag("complete")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: Colors.BORDER_DARK,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {tag === "complete" && (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: Colors.BORDER_DARK,
                      }}
                    />
                  )}
                </View>
                <Text className="ml-2">Complete</Text>
              </TouchableOpacity>

              {/* Radio Button for 'Custom' */}
              <TouchableOpacity
                onPress={() => setTag("custom")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: Colors.BORDER_DARK,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {tag === "custom" && (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: Colors.BORDER_DARK,
                      }}
                    />
                  )}
                </View>
                <Text className="ml-2">Custom</Text>
              </TouchableOpacity>
            </View>

            {/* Categories */}
            <View className="w-full flex-row bg-white p-3 items-center justify-between">
              <MaterialCommunityIcons
                name="tag"
                size={20}
                color={Colors.BORDER_DARK}
              />
              <ScrollView horizontal className="flex-1 px-2 flex-row" contentContainerStyle={{justifyContent:"flex-start",alignItems:"center"}}>
                {categories.length <= 0 ? (
                  <Text className="text-border-dark text-[18px] font-heartful">No tags added yet</Text>
                ) : (
                  categories.map((category, index) => (
                    <View
                      key={index}
                      className="bg-primary-orange-shades-light px-3 py-1 mr-2 rounded-full flex-row items-center"
                    >
                      <Text className="text-[16px] mr-2 text-primary-blue-shades-darkest">
                        {category}
                      </Text>
                      <TouchableOpacity onPress={() => removeCategory(index)}>
                        <Entypo
                          name="cross"
                          size={12}
                          color={Colors.ERROR_RED}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                className="ml-2"
              >
                <AntDesign
                  name="pluscircleo"
                  size={24}
                  color={Colors.BORDER_DARK}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="w-full shadow-lg bg-white mt-3 p-2 pt-3">
          <Text className="px-2 font-heartful text-[24px] text-primary-blue-shades-darkest">
            Pricing
          </Text>
          {/* Pricing */}
          <View className="w-full flex-col bg-white p-2 items-center justify-start">
            <View className="w-full flex-row bg-white items-center justify-start">
              <Text className="font-heartful text-[22px] text-border-dark">
                Fixed:
              </Text>
              <TextInput
                value={pricing.fixed.toString()}
                onChangeText={(value) => {
                  const parsed = parseFloat(value) || 0;
                  setPricing({ ...pricing, fixed: parsed });
                  pricingRef.current = { ...pricingRef.current, fixed: parsed };
                }}
                placeholder="Fixed Price"
                keyboardType="numeric"
                className="text-[18px] opacity-70 w-1/2 font-heartful ml-2"
              />
            </View>
            <View className="w-full flex-row bg-white items-center justify-start">
              <Text className="font-heartful text-[22px] text-border-dark">
                Per Size:
              </Text>
              <TextInput
                value={pricing.per_size.toString()}
                onChangeText={(value) => {
                  const parsed = parseFloat(value) || 0;
                  setPricing({ ...pricing, per_size: parsed });
                  pricingRef.current = {
                    ...pricingRef.current,
                    per_size: parsed,
                  };
                }}
                placeholder="Per Size Price"
                keyboardType="numeric"
                className="text-[18px] opacity-70 w-1/2 font-heartful ml-2"
              />
            </View>
          </View>
        </View>

        <View className="w-full shadow-lg bg-white mt-3 p-2 pt-4">
          <View className="w-full flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="px-2 font-heartful text-[24px] text-primary-blue-shades-darkest">
                Product Images
              </Text>
              <Text className="px-2 font-heartful text-[18px] text-gray-300">
                The first image will be the main product image
              </Text>
            </View>
            {/* Image Picker */}
            <TouchableOpacity onPress={pickImage} className="mr-4">
              <AntDesign
                name="plussquareo"
                size={20}
                color={Colors.BORDER_DARK}
              />
            </TouchableOpacity>
          </View>
          <View className="w-full bg-white p-2 items-start">
            <ScrollView horizontal>
              {imageUrl.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={{ width: 100, height: 100, margin: 5 }}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="w-full shadow-lg bg-white mt-3"></View>
      </ScrollView>
      {/* Modal for adding a new category */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-4 w-4/5 rounded-lg shadow-lg">
            <Text className="text-[18px] mb-4">Add a New Category</Text>
            <TextInput
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Enter category"
              className="border-b border-gray-300 mb-4 text-[16px] p-2"
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="mr-4"
              >
                <Text className="text-[16px] text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addCategory}>
                <Text className="text-[16px] text-primary-blue-shades-darkest">
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddingPageWrapper(
  AddProductPage,
  "/pages/listpages/ProductsListPage"
);
