import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  addCommentToCustomer,
  getCustomerDataById,
  updateCustomerDataById,
  Comment,
} from "@/data/customers-data";
import Colors from "@/constants/Colors";
import { useAlert } from "@/contexts/AlertContext";

interface CommentsDisplayPartProps {
  customerId: string;
}

const CommentsDisplayPart: React.FC<CommentsDisplayPartProps> = ({
  customerId,
}) => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const customer = await getCustomerDataById(customerId);
      if (customer && customer.comments) {
        setComments(customer.comments);
      } else {
        setComments([]);
      }
    };
    fetchComments();
  }, [customerId]);

  const handleAddComment = async () => {
    if (comment.trim().length > 0) {
      await addCommentToCustomer(customerId, comment);
      setComment("");

      const customer = await getCustomerDataById(customerId);
      if (customer && customer.comments) {
        setComments(customer.comments);
      } else {
        setComments([]);
      }
    }
  };

  const { showAlert } = useAlert();

  const handleDeleteComment = async (index: number) => {
    try {
      // Retrieve the existing customer data
      const customer = await getCustomerDataById(customerId);
      if (customer && customer.comments) {
        // Remove the comment at the specified index
        customer.comments.splice(index, 1);
        // Update the customer data
        await updateCustomerDataById(customerId, {
          comments: customer.comments,
        });
        // Update the local state
        setComments(customer.comments);
      }
    } catch (error) {
      showAlert("Failed to delete comment :(", "error");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-1/2 flex-1">
        <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View className="p-2 border-b flex-row border-gray-200">
              <View className="w-6 items-center justify-center mr-2">
                <FontAwesome
                  name="circle-o-notch"
                  size={16}
                  color={Colors.PRIMARY_ORANGE_SHADES.MEDIUM_LIGHT}
                />
              </View>
              <View className="flex-1">
                <Text className="text-[18px] text-[#2c3b68] font-heartful">
                  {item.text}
                </Text>
                <Text className="text-[12px] mt-1 font-heartful text-gray-500">
                  {new Date(item.date).toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                className="w-6 items-center justify-center mr-2"
                onPress={() => handleDeleteComment(index)}
              >
                <AntDesign name="delete" size={16} color={Colors.ERROR_RED} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text className="m-4 font-heartful text-[20px] text-gray-500">
              No comments yet.
            </Text>
          }
        />
      </View>
      <View className="w-full h-14 p-2 flex-row bg-gray-100">
        <TextInput
          value={comment}
          onChangeText={setComment}
          className="flex-1 rounded-3xl p-2 px-4 text-[20px] shadow-sm font-heartful"
          placeholder="Type to add a comment"
        />
        <TouchableOpacity
          className="ml-2 w-10 h-10 bg-gray-300 rounded-full items-center justify-center"
          onPress={handleAddComment}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentsDisplayPart;
