import React, { useState, useRef, useEffect } from 'react';
import { searchByPostcode, searchBySuburb, PostalCodeSuggestion } from '@/utils/postalCodeService';

interface PostalCodeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onSuggestionSelect?: (suggestion: PostalCodeSuggestion) => void;
}

export const PostalCodeAutocomplete: React.FC<PostalCodeAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Enter zip code or suburb",
  className = "",
  required = false,
  onSuggestionSelect
}) => {
  const [suggestions, setSuggestions] = useState<PostalCodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    if (inputValue.length >= 2) {
      setIsLoading(true);
      
      // Determine if input is likely a postcode (numbers) or suburb (letters)
      const isNumeric = /^\d+$/.test(inputValue);
      
      setTimeout(() => {
        const results = isNumeric 
          ? searchByPostcode(inputValue)
          : searchBySuburb(inputValue);
        
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setIsLoading(false);
      }, 100); // Small delay to prevent too many searches
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: PostalCodeSuggestion) => {
    onChange(suggestion.postcode.toString());
    setShowSuggestions(false);
    setSuggestions([]);
    
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${className}`}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.postcode}-${suggestion.suburb}-${index}`}
              className="px-3 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="text-sm font-medium text-gray-900">
                {suggestion.displayText}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
