import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import ListPageWrapper from "@/hoc/ListPageWrapper";
import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import {
  deleteProductById,
  getAllProducts,
  ProductData,
} from "@/data/products-data";

interface ProductsListPageProps {
  searchQuery: string;
  deleteMode: boolean;
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
  toDeleteCustomers: string[];
  setToDeleteCustomers: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface Pricing {
  fixed?: number;
  per_size?: number;
}

export interface Item {
  id: string; // Unique identifier for each product
  name: string;
  description?: string;
  tag: "custom" | "complete";
  pricing: Pricing;
  categories?: string[]; // Array of categories
  imageUrl?: string[]; // URL of the product image
}

const ProductsListPage: React.FC<ProductsListPageProps> = ({
  searchQuery,
  deleteMode,
  setDeleteMode,
  toDeleteCustomers,
  setToDeleteCustomers,
}) => {
  const router = useRouter();
  const navigation = useNavigation();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteIndex, setDeleteIndex] = useState<string | null>(null);
  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);
  const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);

  const handleCheckboxPress = (productId: string) => {
    setIsCheckBoxChecked((prevState) => !prevState);
    // Update toDeleteCustomers array to use IDs
    setToDeleteCustomers((prevArray) => {
      if (prevArray.includes(productId)) {
        // If product ID is already in the array, remove it
        return prevArray.filter((id) => id !== productId);
      } else {
        // If product ID is not in the array, add it
        return [...prevArray, productId];
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
  const fetchProducts = async () => {
    const ProductsData = await getAllProducts();
    console.log(ProductsData);

    const validProducts = ProductsData.filter(
      (product) => product.name.trim() !== ""
    );
    setProducts(validProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (index: string) => {
    setDeleteIndex(index);
  };

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      await deleteProductById(deleteIndex);
      fetchProducts();
    }
  };

  const handleUserDisplay = (
    id: string,
    name: string = "Unknown",
    description: string = "Unknown",
    tag: string = "Unknown",
    pricing: Pricing,
    categories: string[] = [],
    imageUrl: string[] = []
  ) => {
    const base64Urls = imageUrl.map((url) => btoa(url)); // Encode each URL as Base64
    const separator = "|";
    const imageUrlsAsString = base64Urls.join(separator);
    const pricingAsString = pricing.fixed+separator+pricing.per_size;

    console.log(imageUrlsAsString);
    router.push({
      pathname: "/pages/displaypages/ProductDisplayPage",
      params: {
        id,
        name,
        description,
        tag,
        pricingAsString,
        categories,
        imageUrlsAsString,
      },
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      <View className="w-full h-8 flex-row items-center justify-between px-2">
        <Text className="font-heartful text-[24px] text-white ml-4 opacity-70">
          {filteredProducts.length} Products
        </Text>
        <View className="mr-4 flex-row">
          <Text className="font-heartful text-[24px] text-white mr-1">
            Popular
          </Text>
          <AntDesign name="down" size={18} color="white" />
        </View>
      </View>
      <FlatList
        data={filteredProducts}
        numColumns={2} // Display products in two columns
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 8,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }} // Space between columns
        renderItem={({ item, index }: { item: Item; index: number }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-[48%] bg-white rounded-lg overflow-hidden items-center"
            key={index}
            onPress={() =>
              deleteMode
                ? handleCheckboxPress(item.id)
                : handleUserDisplay(
                    item.id,
                    item.name,
                    item.description || "Unknown",
                    item.tag || "Unknown",
                    item.pricing || {}, // Now typed as Pricing
                    item.categories || [],
                    item.imageUrl || []
                  )
            }
            onLongPress={() => handleLongPress(index)}
          >
            {/* Product image placeholder */}
            <View className="relative w-full h-36 bg-border-dark">
              {/* You can render your product image here using <Image> component */}
              <View className="absolute w-full h-full items-center justify-center">
                <MaterialIcons
                  name="error-outline"
                  size={32}
                  color={Colors.BORDER_LIGHT}
                />
              </View>
              <Image
                key={index}
                source={{ uri: item.imageUrl?.[0] }}
                className="w-full h-full"
              />
            </View>

            <View className="w-full justify-start items-start p-2 gap-1">
              <Text className="font-heartful text-[26px] text-primary-blue-shades-darkest">
                {item.name}
              </Text>
              <Text className="font-heartful text-[18px] text-border-dark opacity-60 line-clamp-2">
                {item.description}
              </Text>
              <View className="w-full flex-row justify-between items-center pr-2">
                <Text className="font-heartful text-[26px] text-primary-blue-shades-darkest">
                  {item.pricing.fixed}
                </Text>
                {deleteMode ? (
                  <View className="flex-row justify-end">
                    <AntDesign
                      name={
                        toDeleteCustomers.includes(item.id)
                          ? "checksquare"
                          : "checksquareo"
                      }
                      size={16}
                      color={Colors.BUTTON_PRIMARY}
                    />
                  </View>
                ) : (
                  <View className="flex-row justify-evenly">
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Entypo
                        name="share"
                        size={18}
                        color={Colors.PRIMARY_BLUE_SHADES.DARKEST}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-2xl font-heartful text-primary-blue-shades-darkest mt-4">
            No Products available
          </Text>
        }
      />

      <View className="absolute w-full h-full justify-end items-end p-4">
        <TouchableOpacity
          className="w-16 h-16 bg-white rounded-full items-center justify-center"
          activeOpacity={0.7}
          onPress={() => router.push("/pages/addingpages/AddProductPage")}
        >
          <MaterialCommunityIcons
            name="plus"
            size={32}
            color={Colors.PRIMARY_BLUE_SHADES.DARKEST}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListPageWrapper(ProductsListPage, "Products");
