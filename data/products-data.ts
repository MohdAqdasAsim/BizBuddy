import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

export interface Pricing {
  fixed?: number;
  per_size?: number;
}

export interface ProductData {
  id: string; // Unique identifier for each product
  name: string;
  description?: string;
  tag: "custom" | "complete";
  pricing: Pricing;
  categories?: string[]; // Array of categories
  imageUrl?: string[]; // URL of the product image
}

const PRODUCT_STORAGE_KEY = 'products';

export const saveProductData = async (data: Omit<ProductData, 'id'>) => {
  try {
    const existingProducts = await getAllProducts();
    const newProduct = { ...data, id: uuidv4() }; // Assign a new unique ID
    const updatedProducts = [...existingProducts, newProduct];
    await AsyncStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
  } catch (error) {
    console.error('Failed to save product data:', error);
  }
};

export const getAllProducts = async (): Promise<ProductData[]> => {
  try {
    const productsString = await AsyncStorage.getItem(PRODUCT_STORAGE_KEY);
    if (productsString) {
      try {
        const parsedData = JSON.parse(productsString);
        // Ensure parsed data is an array
        return Array.isArray(parsedData) ? parsedData : [];
      } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error('Failed to retrieve product data:', error);
    return [];
  }
};

// Retrieve product data by id
export const getProductDataById = async (id: string): Promise<ProductData | undefined> => {
  try {
    const existingProducts = await getAllProducts();
    const product = existingProducts.find(product => product.id === id);
    if (product) {
      return product;
    } else {
      Alert.alert(`product with ID "${id}" not found.`);
      return undefined;
    }
  } catch (error) {
    console.error('Failed to retrieve product data:', error);
    return undefined;
  }
};

// Update existing product data based on id
export const updateProductDataById = async (id: string, updatedData: Partial<Omit<ProductData, 'id'>>) => {
  try {
    // Retrieve all products first
    const existingProducts = await getAllProducts();

    // Find the index of the product to update
    const index = existingProducts.findIndex(product => product.id === id);
    
    if (index === -1) {
      Alert.alert(`Product with ID "${id}" not found.`);
      return;
    }

    // Merge existing product data with updated data
    const updatedProduct = {
      ...existingProducts[index],
      ...updatedData
    };

    // Replace the old product data with the updated one
    existingProducts[index] = updatedProduct;

    // Update the storage with the modified product list
    await AsyncStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(existingProducts));
  } catch (error) {
    console.error('Failed to update product data:', error);
    Alert.alert('Failed to update product data. Please try again.');
  }
};

// Delete product by id
export const deleteProductById = async (id: string) => {
  try {
    let existingProducts = await getAllProducts();
    existingProducts = existingProducts.filter(product => product.id !== id);
    await AsyncStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(existingProducts));
    Alert.alert('Product deleted successfully.');
  } catch (error) {
    console.error('Failed to delete product:', error);
    Alert.alert('Failed to delete product. Please try again.');
  }
};

// Function to delete multiple products by ids
export const deleteProductsByIds = async (idsToDelete: string[]) => {
  try {
    let existingProducts = await getAllProducts();
    
    // Filter out products whose ids are in the idsToDelete array
    const updatedProducts = existingProducts.filter(product => 
      !idsToDelete.includes(product.id)
    );

    // Save the updated product list back to AsyncStorage
    await AsyncStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));

    Alert.alert('Products deleted successfully.');
  } catch (error) {
    console.error('Failed to delete products:', error);
    Alert.alert('Failed to delete products. Please try again.');
  }
};