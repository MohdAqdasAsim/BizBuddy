import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NavigationBlob from "./NavigationBlob";
import Colors from "@/constants/Colors";

const Dashboard = () => {
  const router = useRouter();
  const totalReceivables = 0;
  const totalPayables = 0;

  const NavigationBlobsData = [
    {
      id: 1,
      name:"Customers",
      navigationPath: "/pages/listpages/CustomersListPage",
      iconName: "account",
      iconColor: Colors.WHITE,
      iconSize: 24,
    },
    {
      id: 2,
      name:"Products",
      navigationPath: "/pages/listpages/ProductsListPage",
      iconName: "shopping",
      iconColor: Colors.WHITE,
      iconSize: 24,
    },
    {
      id: 3,
      name:"Billing & Invoices",
      navigationPath: "/pages/listpages/BillingsListPage",
      iconName: "file-check",
      iconColor: Colors.WHITE,
      iconSize: 24,
    },
    {
      id: 4,
      name:"Payment History",
      navigationPath: "/pages/listpages/PaymentsListPage",
      iconName: "credit-card-fast",
      iconColor: Colors.WHITE,
      iconSize: 24,
    },
  ];

  return (
    <View className="w-full bg-primary-blue-shades-light rounded-lg h-[320px] overflow-hidden shadow-sm shadow-slate-100 p-2 items-center">
      <View className="w-full h-2/3 flex-row">
        <View className="w-1/2 h-full rounded-lg p-1">
          <View className="w-full h-full rounded-lg bg- overflow-hidden bg-background-dark">
            <View className="w-full h-1/2 p-2 justify-center">
              <TouchableOpacity>
                <Text className="text-[18px] font-heartful text-button-primary-text">
                  Total Receivables
                </Text>
                <View className="flex-row gap-1">
                  <Text className="text-[18px] font-heartful text-button-primary-text">{totalReceivables}</Text>
                  <MaterialCommunityIcons name="arrow-bottom-right" size={18} onPress={()=>router.push("/home")} color={Colors.WHITE} />
                </View>
              </TouchableOpacity>
            </View>
            <View className="w-full h-1/2 p-2 justify-center">
              <TouchableOpacity>
                <Text className="text-[18px] font-heartful text-button-primary-text">
                  Total Payables
                </Text>
                <View className="flex-row gap-1">
                  <Text className="text-[18px] font-heartful text-button-primary-text">{totalPayables}</Text>
                  <MaterialCommunityIcons name="arrow-bottom-right" size={18} onPress={()=>router.push("/home")} color={Colors.WHITE} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="w-1/2 h-full">
          <View className="w-full h-1/2 rounded-lg p-1">
            <View className="w-full h-full rounded-lg bg-red-50"></View>
          </View>
          <View className="w-full h-1/2 rounded-lg p-1">
            <View className="w-full h-full rounded-lg bg-red-50"></View>
          </View>
        </View>
      </View>
      <View className="w-full h-[100px] rounded-lg m-1 flex-row shadow-slate-100 shadow-sm bg-button-primary-text">
        {NavigationBlobsData.map((NavigationBlobData) => (
          <NavigationBlob
            key={NavigationBlobData.id}
            name={NavigationBlobData.name}
            navigationPath={NavigationBlobData.navigationPath}
            iconName={NavigationBlobData.iconName}
            iconSize={NavigationBlobData.iconSize}
            iconColor={NavigationBlobData.iconColor}
          />
        ))}
      </View>
    </View>
  );
};

export default Dashboard;
