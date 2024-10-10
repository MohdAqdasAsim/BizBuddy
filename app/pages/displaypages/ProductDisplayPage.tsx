import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect } from "react";
import DisplayPageWrapper from "@/hoc/DisplayPageWrapper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface ProductDisplayPageProps {
  id: string;
  name: string;
  description: string;
  tag: string;
  pricingAsString: string;
  categories: string[];
  imageUrlsAsString: string;
}

const ProductDisplayPage: React.FC<ProductDisplayPageProps> = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const {
    id,
    name,
    description,
    tag,
    pricingAsString,
    categories,
    imageUrlsAsString,
  } = useLocalSearchParams();

  const imageUrls =
    typeof imageUrlsAsString == "string"
      ? imageUrlsAsString.split("|").map((url) => atob(url))
      : [];

  const pricing =
    typeof pricingAsString == "string" ? pricingAsString.split("|") : [];

  const handleEditPress = (id: string) => {
    router.push(`/pages/addingpages/AddProductPage?productId=${id}`);
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

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      router.push("/pages/listpages/ProductsListPage");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View className="w-full h-full bg-primary-blue-shades-darkest">
      <ScrollView
        className="flex-1 bg-white rounded-t-3xl shadow-lg p-4"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View className="w-full h-64">
          <Image
            source={{ uri: imageUrls?.[0] }}
            className="w-full h-full rounded-3xl shadow-lg"
          />
        </View>
        <View className="w-full flex-row justify-between items-center py-2">
          <Text className="font-heartful text-[28px] text-primary-blue-shades-darker">{name}</Text>
          <View className="border-2 border-border-dark items-center justify-center">
            <Text className="font-heartful text-[18px] text-border-dark">
              {tag.toString().toUpperCase()}
            </Text>
          </View>
        </View>
        <View className="w-full">
          <Text className="text-[20px] font-heartful text-border-dark">{description}</Text>
        </View>

        <View className="w-full mt-4">
          <Text className="text-[28px] font-heartful text-primary-blue-shades-darker">Pricing</Text>
          <Text className="text-[20px] font-heartful text-border-dark">Fixed: {pricing[0]}</Text>
          <Text className="text-[20px] font-heartful text-border-dark">Per Size: {pricing[1]}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default DisplayPageWrapper(
  ProductDisplayPage,
  "/pages/listpages/ProductsListPage"
);
