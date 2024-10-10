// customers-data.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export interface SocialLink {
  platform: string;
  url: string;
}

export interface MobileNumber {
  number: string;
  tag: string;
}

export interface Comment {
  text: string;
  date: string;
}

export interface CustomerData {
  id: string; // Unique identifier
  name: string;
  companyName?: string;
  mobileNumbers?: MobileNumber[];
  address?: string;
  email?: string;
  customerType: "business" | "individual";
  comments?: Comment[];
  socialLinks?: SocialLink[];
}

const CUSTOMER_STORAGE_KEY = 'customers';

export const saveCustomerData = async (data: Omit<CustomerData, 'id'>) => {
  try {
    const existingCustomers = await getAllCustomers();
    console.log(existingCustomers);
    
    const newCustomer = { ...data, id: uuidv4() }; // Assign a new unique ID
    const updatedCustomers = [...existingCustomers, newCustomer];
    await AsyncStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedCustomers));
  } catch (error) {
    console.error('Failed to save Customer data:', error);
  }
};

export const getAllCustomers = async (): Promise<CustomerData[]> => {
  try {
    const CustomersString = await AsyncStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (CustomersString) {
      try {
        const parsedData = JSON.parse(CustomersString);
        // Ensure parsed data is an array
        return Array.isArray(parsedData) ? parsedData : [];
      } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error('Failed to retrieve Customer data:', error);
    return [];
  }
};

// Retrieve customer data by id
export const getCustomerDataById = async (id: string): Promise<CustomerData | undefined> => {
  try {
    const existingCustomers = await getAllCustomers();
    const customer = existingCustomers.find(customer => customer.id === id);
    if (customer) {
      return customer;
    } else {
      Alert.alert(`Customer with ID "${id}" not found.`);
      return undefined;
    }
  } catch (error) {
    console.error('Failed to retrieve customer data:', error);
    return undefined;
  }
};

// Update existing customer data based on id
export const updateCustomerDataById = async (id: string, updatedData: Partial<Omit<CustomerData, 'id'>>) => {
  try {
    // Retrieve all customers first
    const existingCustomers = await getAllCustomers();

    // Find the index of the customer to update
    const index = existingCustomers.findIndex(customer => customer.id === id);
    
    if (index === -1) {
      Alert.alert(`Customer with ID "${id}" not found.`);
      return;
    }

    // Merge existing customer data with updated data
    const updatedCustomer = {
      ...existingCustomers[index],
      ...updatedData
    };

    // Replace the old customer data with the updated one
    existingCustomers[index] = updatedCustomer;

    // Update the storage with the modified customer list
    await AsyncStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(existingCustomers));
  } catch (error) {
    console.error('Failed to update customer data:', error);
    Alert.alert('Failed to update customer data. Please try again.');
  }
};

// Delete customer by id
export const deleteCustomerById = async (id: string) => {
  try {
    let existingCustomers = await getAllCustomers();
    existingCustomers = existingCustomers.filter(customer => customer.id !== id);
    await AsyncStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(existingCustomers));
    Alert.alert('Customer deleted successfully.');
  } catch (error) {
    console.error('Failed to delete customer:', error);
    Alert.alert('Failed to delete customer. Please try again.');
  }
};

// Function to delete multiple customers by ids
export const deleteCustomersByIds = async (idsToDelete: string[]) => {
  try {
    let existingCustomers = await getAllCustomers();
    
    // Filter out customers whose ids are in the idsToDelete array
    const updatedCustomers = existingCustomers.filter(customer => 
      !idsToDelete.includes(customer.id)
    );

    // Save the updated customer list back to AsyncStorage
    await AsyncStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedCustomers));

    Alert.alert('Customers deleted successfully.');
  } catch (error) {
    console.error('Failed to delete customers:', error);
    Alert.alert('Failed to delete customers. Please try again.');
  }
};

// Add a comment to a customer
export const addCommentToCustomer = async (customerId: string, commentText: string) => {
  try {
    let existingCustomers = await getAllCustomers();
    const customerIndex = existingCustomers.findIndex(customer => customer.id === customerId);

    if (customerIndex !== -1) {
      const date = new Date().toISOString();
      const newComment: Comment = { text: commentText, date };

      if (!existingCustomers[customerIndex].comments) {
        existingCustomers[customerIndex].comments = [];
      }

      existingCustomers[customerIndex].comments.push(newComment);

      await AsyncStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(existingCustomers));
    } else {
      Alert.alert(`Customer with ID "${customerId}" not found.`);
    }
  } catch (error) {
    console.error('Failed to add comment to customer:', error);
  }
};

// Add a social link to a customer
export const addSocialLinkToCustomer = async (customerId: string, platform: string, url: string) => {
  try {
    let existingCustomers = await getAllCustomers();
    const customerIndex = existingCustomers.findIndex(customer => customer.id === customerId);

    if (customerIndex !== -1) {
      const newSocialLink: SocialLink = { platform, url };

      if (!existingCustomers[customerIndex].socialLinks) {
        existingCustomers[customerIndex].socialLinks = [];
      }

      existingCustomers[customerIndex].socialLinks.push(newSocialLink);

      await AsyncStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(existingCustomers));
    } else {
      Alert.alert(`Customer with ID "${customerId}" not found.`);
    }
  } catch (error) {
    console.error('Failed to add social link to customer:', error);
  }
};

// Remove a social link from a customer by index
export const removeSocialLinkFromCustomer = async (customerId: string, linkIndex: number) => {
  try {
    let existingCustomers = await getAllCustomers();
    const customerIndex = existingCustomers.findIndex(customer => customer.id === customerId);

    if (customerIndex !== -1) {
      if (existingCustomers[customerIndex].socialLinks) {
        existingCustomers[customerIndex].socialLinks = existingCustomers[customerIndex].socialLinks.filter((_, i) => i !== linkIndex);

        await AsyncStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(existingCustomers));
      } else {
        Alert.alert(`No social links found for customer with ID "${customerId}".`);
      }
    } else {
      Alert.alert(`Customer with ID "${customerId}" not found.`);
    }
  } catch (error) {
    console.error('Failed to remove social link from customer:', error);
  }
};

// Get all social links for a customer
export const getSocialLinksForCustomer = async (customerId: string): Promise<SocialLink[] | undefined> => {
  try {
    let existingCustomers = await getAllCustomers();
    const customer = existingCustomers.find(cust => cust.id === customerId);

    if (customer) {
      return customer.socialLinks || [];
    } else {
      Alert.alert(`Customer with ID "${customerId}" not found.`);
      return [];
    }
  } catch (error) {
    console.error('Failed to retrieve social links for customer:', error);
    return [];
  }
};