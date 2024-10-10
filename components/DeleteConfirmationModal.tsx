import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Modal from "react-native-modal";

interface DeleteConfirmationModalProps {
  isModalVisible: boolean,
  setIsModalVisible:(value: React.SetStateAction<boolean>) => void,
  confirmDelete:() => Promise<void>,
}

const DeleteConfirmationModal:React.FC<DeleteConfirmationModalProps> = ({isModalVisible,setIsModalVisible,confirmDelete}) => {
  return (
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
          Are you sure you want to delete these customers?
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
  );
};

export default DeleteConfirmationModal;
