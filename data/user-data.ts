// user-data.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  name: string;
  companyName: string;
  email: string;
  profilePicture: string | null;
}

export let userData: User = {
  name: "John Doe",
  companyName: "Tech Solutions",
  email: "john.doe@techsolutions.com",
  profilePicture: null,
};

/**
 * Updates the userData object and persists the changes.
 * @param updates - A partial User object with the fields to update.
 */
export async function updateUserData(updates: Partial<User>): Promise<void> {
  userData = { ...userData, ...updates };
  // Save the updated data to AsyncStorage
  await AsyncStorage.setItem("userData", JSON.stringify(userData));
}

// Load the user data from AsyncStorage when the app starts
export async function loadUserData(): Promise<void> {
  const storedUserData = await AsyncStorage.getItem("userData");
  if (storedUserData) {
    userData = JSON.parse(storedUserData);
  }
}
