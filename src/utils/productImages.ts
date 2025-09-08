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
  console.log('🖼️ getProductImage called with:', productName);
  console.log('🗺️ Available product names:', Object.keys(productImageMap));
  
  // Try exact match first
  let image = productImageMap[productName];
  
  // If not found, try to find by converting to proper case
  if (!image) {
    const properCaseName = productName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    console.log('🔄 Trying proper case:', properCaseName);
    image = productImageMap[properCaseName];
  }
  
  console.log('🔍 Product found in map:', image ? 'YES' : 'NO');
  console.log('📸 Returning image:', image || milafcola);
  
  return image || milafcola; // fallback to milafcola if not found
};

// Function to get all available product names
export const getAvailableProductNames = (): string[] => {
  return Object.keys(productImageMap);
};
