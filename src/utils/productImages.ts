// Import all product images
import milafcola from "@/assets/milafcola.png";
import chocospread from "@/assets/chocospread.png";
import datespread from "@/assets/datespread.png";
import safawidates from "@/assets/safawidates.png";
import khalasdates from "@/assets/khalasdates.png";
import segaidates from "@/assets/segaidates.png";

// Map product names to their corresponding images
export const productImageMap: { [key: string]: string } = {
  "Milaf Cola": milafcola,
  "Choco Spread": chocospread,
  "Date Spread": datespread,
  "Safawi Dates": safawidates,
  "Khalas Dates": khalasdates,
  "Segai Dates": segaidates,
};

// Function to get product image by name
export const getProductImage = (productName: string): string => {
  return productImageMap[productName] || milafcola; // fallback to milafcola if not found
};

// Function to get all available product names
export const getAvailableProductNames = (): string[] => {
  return Object.keys(productImageMap);
};
