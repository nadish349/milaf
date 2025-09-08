import postalCodesData from '@/assets/postalcodes.json';

export interface PostalCodeData {
  Postcode: number;
  Suburb: string;
  State: string;
}

export interface PostalCodeSuggestion {
  postcode: number;
  suburb: string;
  state: string;
  displayText: string;
}

// Load postal codes data
const postalCodes: PostalCodeData[] = postalCodesData;

/**
 * Search postal codes by postcode number
 */
export const searchByPostcode = (query: string): PostalCodeSuggestion[] => {
  if (!query || query.length < 2) return [];
  
  const postcodeNum = parseInt(query);
  if (isNaN(postcodeNum)) return [];
  
  return postalCodes
    .filter(item => item.Postcode.toString().startsWith(query))
    .slice(0, 10) // Limit to 10 results
    .map(item => ({
      postcode: item.Postcode,
      suburb: item.Suburb,
      state: item.State,
      displayText: `${item.Postcode} - ${item.Suburb}, ${item.State}`
    }));
};

/**
 * Search postal codes by suburb name or address keywords
 */
export const searchBySuburb = (query: string): PostalCodeSuggestion[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return postalCodes
    .filter(item => 
      item.Suburb.toLowerCase().includes(lowercaseQuery) ||
      item.State.toLowerCase().includes(lowercaseQuery) ||
      // Also search for common address keywords
      item.Suburb.toLowerCase().split(' ').some(word => word.startsWith(lowercaseQuery))
    )
    .slice(0, 10) // Limit to 10 results
    .map(item => ({
      postcode: item.Postcode,
      suburb: item.Suburb,
      state: item.State,
      displayText: `${item.Suburb}, ${item.State} - ${item.Postcode}`
    }));
};

/**
 * Search for addresses by any keyword (suburb, state, or partial address)
 */
export const searchByAddress = (query: string): PostalCodeSuggestion[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return postalCodes
    .filter(item => {
      const suburbMatch = item.Suburb.toLowerCase().includes(lowercaseQuery);
      const stateMatch = item.State.toLowerCase().includes(lowercaseQuery);
      const wordMatch = item.Suburb.toLowerCase().split(' ').some(word => 
        word.startsWith(lowercaseQuery) || lowercaseQuery.includes(word)
      );
      
      return suburbMatch || stateMatch || wordMatch;
    })
    .slice(0, 15) // More results for address search
    .map(item => ({
      postcode: item.Postcode,
      suburb: item.Suburb,
      state: item.State,
      displayText: `${item.Suburb}, ${item.State} - ${item.Postcode}`
    }));
};

/**
 * Get all suburbs for a specific postcode
 */
export const getSuburbsByPostcode = (postcode: number): string[] => {
  return postalCodes
    .filter(item => item.Postcode === postcode)
    .map(item => item.Suburb)
    .filter((suburb, index, array) => array.indexOf(suburb) === index); // Remove duplicates
};

/**
 * Get postcode for a specific suburb
 */
export const getPostcodeBySuburb = (suburb: string, state?: string): number[] => {
  return postalCodes
    .filter(item => {
      const suburbMatch = item.Suburb.toLowerCase() === suburb.toLowerCase();
      const stateMatch = state ? item.State.toLowerCase() === state.toLowerCase() : true;
      return suburbMatch && stateMatch;
    })
    .map(item => item.Postcode)
    .filter((postcode, index, array) => array.indexOf(postcode) === index); // Remove duplicates
};
