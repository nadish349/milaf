import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { fetchAllProductsFromFirestore, ProductData } from '@/services/productService';
import milafcola from "@/assets/milafcola.png";
import chocospread from "@/assets/chocospread.png";
import datespread from "@/assets/datespread.png";
import safawidates from "@/assets/safawidates.png";
import khalasdates from "@/assets/khalasdates.png";
import segaidates from "@/assets/segaidates.png";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  casePrice: number;
  pricePerCase: number; // New field for storing case price
  casesInStock: number;
  casesPerCase: number;
  totalUnits: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  category: string;
  description: string;
}

export const AdminProducts = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [savingProducts, setSavingProducts] = useState<Set<number>>(new Set());
  const [saveStatus, setSaveStatus] = useState<{[key: number]: 'success' | 'error' | null}>({});

  const categories = ["all", "Beverages", "Spreads", "Dates"];

  // Map product names to their images
  const productImages: { [key: string]: string } = {
    "Milaf Cola": milafcola,
    "Choco Spread": chocospread,
    "Date Spread": datespread,
    "Safawi Dates": safawidates,
    "Khalas Dates": khalasdates,
    "Segai Dates": segaidates,
  };

  // Convert Firestore ProductData to Product interface
  const convertToProduct = (firestoreData: ProductData, id: number): Product => {
    return {
      id,
      name: firestoreData.name,
      image: productImages[firestoreData.name] || milafcola, // fallback image
      price: firestoreData.price,
      casePrice: firestoreData.casePrice || 0,
      pricePerCase: firestoreData.pricePerCase || firestoreData.casePrice || 0, // Use pricePerCase from Firestore, fallback to casePrice
      casesInStock: firestoreData.casesInStock,
      casesPerCase: firestoreData.casesPerCase,
      totalUnits: firestoreData.totalUnits,
      status: firestoreData.status,
      category: firestoreData.category,
      description: firestoreData.description,
    };
  };

  // Fetch products from Firestore on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const firestoreProducts = await fetchAllProductsFromFirestore();
        
        if (firestoreProducts.length > 0) {
          // Use products from Firestore (backend)
          const convertedProducts = firestoreProducts.map((product, index) => 
            convertToProduct(product, index + 1)
          );
          setProducts(convertedProducts);
        } else {
          // Fallback to default products only if no data in Firestore
          const defaultProducts: Product[] = [
              {
                id: 1,
                name: "Milaf Cola",
                image: milafcola,
                price: 4.99,
                casePrice: 99.80,
                pricePerCase: 99.80,
                casesInStock: 150,
                casesPerCase: 20,
                totalUnits: 3000,
                status: "In Stock",
                category: "Beverages",
                description: "Refreshing natural cola drink"
              },
              {
                id: 2,
                name: "Choco Spread",
                image: chocospread,
                price: 6.99,
                casePrice: 167.76,
                pricePerCase: 167.76,
                casesInStock: 75,
                casesPerCase: 24,
                totalUnits: 1800,
                status: "Low Stock",
                category: "Spreads",
                description: "Rich chocolate date spread"
              },
              {
                id: 3,
                name: "Date Spread",
                image: datespread,
                price: 7.99,
                casePrice: 159.80,
                pricePerCase: 159.80,
                casesInStock: 200,
                casesPerCase: 20,
                totalUnits: 4000,
                status: "In Stock",
                category: "Spreads",
                description: "Natural date spread"
              },
              {
                id: 4,
                name: "Safawi Dates",
                image: safawidates,
                price: 8.99,
                casePrice: 224.75,
                pricePerCase: 224.75,
                casesInStock: 0,
                casesPerCase: 25,
                totalUnits: 0,
                status: "Out of Stock",
                category: "Dates",
                description: "Premium quality dates"
              },
              {
                id: 5,
                name: "Khalas Dates",
                image: khalasdates,
                price: 9.99,
                casePrice: 299.70,
                pricePerCase: 299.70,
                casesInStock: 120,
                casesPerCase: 30,
                totalUnits: 3600,
                status: "In Stock",
                category: "Dates",
                description: "Premium Khalas dates from Saudi Arabia"
              },
              {
                id: 6,
                name: "Segai Dates",
                image: segaidates,
                price: 10.99,
                casePrice: 274.75,
                pricePerCase: 274.75,
                casesInStock: 80,
                casesPerCase: 25,
                totalUnits: 2000,
                status: "In Stock",
                category: "Dates",
                description: "High-quality Segai dates"
              },
            ];
            setProducts(defaultProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Set fallback products on error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateStock = (productId: number, newCases: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const totalUnits = newCases * product.casesPerCase;
        let status: "In Stock" | "Low Stock" | "Out of Stock";
        
        if (newCases === 0) status = "Out of Stock";
        else if (newCases <= 50) status = "Low Stock";
        else status = "In Stock";

        return {
          ...product,
          casesInStock: newCases,
          totalUnits,
          status
        };
      }
      return product;
    }));
  };

  const startEditing = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const saveEdit = async () => {
    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        totalUnits: editingProduct.casesInStock * editingProduct.casesPerCase,
        status: editingProduct.casesInStock === 0 ? "Out of Stock" : 
                editingProduct.casesInStock <= 50 ? "Low Stock" : "In Stock"
      } as Product;

      // Update local state first
      setProducts(prev => prev.map(product => 
        product.id === editingProduct.id ? updatedProduct : product
      ));

      // Save to Firestore
      try {
        setSavingProducts(prev => new Set(prev).add(editingProduct.id));
        setSaveStatus(prev => ({ ...prev, [editingProduct.id]: null }));
        
        const productRef = doc(db, 'products', updatedProduct.name);
        const productData = {
          name: updatedProduct.name,
          price: updatedProduct.price,
          casePrice: updatedProduct.casePrice,
          pricePerCase: updatedProduct.pricePerCase, // Save the pricePerCase field
          casesInStock: updatedProduct.casesInStock,
          casesPerCase: updatedProduct.casesPerCase,
          totalUnits: updatedProduct.totalUnits,
          status: updatedProduct.status,
          category: updatedProduct.category,
          description: updatedProduct.description,
          lastUpdated: new Date().toISOString()
        };
        
        // Use merge: true to update existing document or create new one
        await setDoc(productRef, productData, { merge: true });
        
        console.log(`✅ Product "${updatedProduct.name}" saved to Firestore successfully`);
        setSaveStatus(prev => ({ ...prev, [editingProduct.id]: 'success' }));
        
        // Clear success status after 3 seconds
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, [editingProduct.id]: null }));
        }, 3000);
        
      } catch (error) {
        console.error('❌ Error saving product to Firestore:', error);
        setSaveStatus(prev => ({ ...prev, [editingProduct.id]: 'error' }));
        
        // Clear error status after 5 seconds
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, [editingProduct.id]: null }));
        }, 5000);
      } finally {
        setSavingProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(editingProduct.id);
          return newSet;
        });
      }

      setEditingProduct(null);
      
      // Refresh products from Firestore after saving
      const refreshProducts = async () => {
        try {
          const firestoreProducts = await fetchAllProductsFromFirestore();
          if (firestoreProducts.length > 0) {
            const convertedProducts = firestoreProducts.map((product, index) => 
              convertToProduct(product, index + 1)
            );
            setProducts(convertedProducts);
          }
        } catch (error) {
          console.error('Error refreshing products:', error);
        }
      };
      
      // Refresh after a short delay to ensure Firestore has updated
      setTimeout(refreshProducts, 1000);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };


  const fetchProductFromFirestore = async (productName: string) => {
    try {
      const productRef = doc(db, 'products', productName);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const data = productSnap.data();
        return {
          name: data.name,
          price: data.price,
          casePrice: data.casePrice,
          pricePerCase: data.pricePerCase || data.casePrice || 0,
          casesInStock: data.casesInStock,
          casesPerCase: data.casesPerCase,
          totalUnits: data.totalUnits,
          status: data.status,
          category: data.category,
          description: data.description
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product from Firestore:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products from database...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Products Management</h1>
            <p className="text-gray-600">Manage your product inventory and stock levels</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex-shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Product Image */}
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-4"
              />
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      name: e.target.value
                    })}
                    className="text-lg font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none flex-1 mr-2"
                  />
                ) : (
                  <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                )}
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>

              {editingProduct?.id === product.id ? (
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    description: e.target.value
                  })}
                  className="w-full text-sm text-gray-600 mb-3 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={2}
                />
              ) : (
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              )}
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price (per unit):</span>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0
                      })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="font-semibold">${product.price}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Case Price:</span>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.pricePerCase}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        pricePerCase: parseFloat(e.target.value) || 0,
                        casePrice: parseFloat(e.target.value) || 0 // Also update casePrice for backward compatibility
                      })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="font-semibold">${product.pricePerCase}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  {editingProduct?.id === product.id ? (
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        category: e.target.value
                      })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Beverages">Beverages</option>
                      <option value="Spreads">Spreads</option>
                      <option value="Dates">Dates</option>
                    </select>
                  ) : (
                    <span className="font-semibold">{product.category}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Units per Case:</span>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      min="1"
                      value={editingProduct.casesPerCase}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        casesPerCase: parseInt(e.target.value) || 1
                      })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="font-semibold">{product.casesPerCase}</span>
                  )}
                </div>
              </div>

              {/* Stock Management */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Cases in Stock:</span>
                  <span className="text-lg font-bold text-gray-900">{product.casesInStock}</span>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Total Units:</span>
                  <span className="text-sm font-medium text-gray-700">{product.totalUnits}</span>
                </div>

                {/* Stock Update Input */}
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="number"
                    min="0"
                    value={editingProduct?.id === product.id ? editingProduct.casesInStock : product.casesInStock}
                    onChange={(e) => {
                      if (editingProduct?.id === product.id) {
                        setEditingProduct({
                          ...editingProduct,
                          casesInStock: parseInt(e.target.value) || 0
                        });
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Update cases"
                  />
                  <span className="text-xs text-gray-500">cases</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {editingProduct?.id === product.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        disabled={savingProducts.has(product.id)}
                        className={`flex-1 text-white text-sm py-2 px-3 rounded-lg transition-colors ${
                          saveStatus[product.id] === 'success' 
                            ? 'bg-green-600' 
                            : saveStatus[product.id] === 'error'
                            ? 'bg-red-500'
                            : 'bg-green-500 hover:bg-green-600 disabled:bg-green-300'
                        }`}
                      >
                        {savingProducts.has(product.id) 
                          ? 'Saving...' 
                          : saveStatus[product.id] === 'success'
                          ? '✅ Saved!'
                          : saveStatus[product.id] === 'error'
                          ? '❌ Error'
                          : 'Save'
                        }
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={savingProducts.has(product.id)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(product)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                      >
                        Edit Product
                      </button>
                      <button
                        onClick={() => updateStock(product.id, product.casesInStock + 10)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                      >
                        +10 Cases
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.status === "In Stock").length}
            </div>
            <div className="text-sm text-green-600">In Stock</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.status === "Low Stock").length}
            </div>
            <div className="text-sm text-yellow-600">Low Stock</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => p.status === "Out of Stock").length}
            </div>
            <div className="text-sm text-red-600">Out of Stock</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {products.reduce((sum, p) => sum + p.totalUnits, 0).toLocaleString()}
            </div>
            <div className="text-sm text-blue-600">Total Units</div>
          </div>
        </div>
      </div>
    </div>
  );
};
