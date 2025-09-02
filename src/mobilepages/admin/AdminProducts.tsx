import React, { useState } from "react";
import titledcolacandesign4 from "@/assets/titledcolacandesign4.png";
import chocospread from "@/assets/chocospread.png";
import datespread from "@/assets/datespread.png";
import safawidates from "@/assets/safawidates.png";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  casesInStock: number;
  casesPerCase: number;
  totalUnits: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  category: string;
  description: string;
}

export const AdminProducts = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Milaf Cola",
      image: titledcolacandesign4,
      price: 4.99,
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
      casesInStock: 0,
      casesPerCase: 25,
      totalUnits: 0,
      status: "Out of Stock",
      category: "Dates",
      description: "Premium quality dates"
    }
  ]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Beverages", "Spreads", "Dates"];

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

  const saveEdit = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(product => 
        product.id === editingProduct.id ? editingProduct : product
      ));
      setEditingProduct(null);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Products Management</h1>
            <p className="text-gray-600">Manage your product inventory and stock levels</p>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
            + Add Product
          </button>
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
                <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">${product.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Units per Case:</span>
                  <span className="font-semibold">{product.casesPerCase}</span>
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
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-lg transition-colors"
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
                        Edit Stock
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
