import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCartFetcher } from "@/services/cartFetcher";

export interface OrderSummaryData {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  shippingCharge: string;
  casesTotal: number;
  piecesTotal: number;
  casesCount: number;
  piecesCount: number;
}

export interface ProcessedCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  cases?: boolean;
  pieces?: boolean;
  cartType: 'regular' | 'product' | 'bulk';
  originalPrice?: number;
}

export const useOrderSummary = (cartItems: any[] = []) => {
  const { user } = useAuth();

  // Calculate order summary from processed cart items
  const calculateOrderSummary = (): OrderSummaryData => {
    let subtotal = 0;
    let itemCount = 0;
    let casesTotal = 0;
    let piecesTotal = 0;
    let casesCount = 0;
    let piecesCount = 0;

    // Use the provided cart items (already processed by cartFetcher)
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      itemCount += item.quantity;

      if (item.cases === true) {
        casesTotal += itemTotal;
        casesCount += item.quantity;
      } else if (item.pieces === true) {
        piecesTotal += itemTotal;
        piecesCount += item.quantity;
      }
    });

    // Calculate shipping (free shipping over $50, otherwise $5.99)
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;
    const shippingCharge = subtotal >= 50 ? "FREE" : `$${shipping.toFixed(2)}`;

    return {
      subtotal,
      shipping,
      total,
      itemCount,
      shippingCharge,
      casesTotal,
      piecesTotal,
      casesCount,
      piecesCount
    };
  };

  const orderSummary = calculateOrderSummary();

  // Helper functions
  const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

  const getShippingMessage = (subtotal: number): string => {
    if (subtotal >= 50) {
      return ""; // No message for free shipping
    } else {
      const remaining = 50 - subtotal;
      return `Add $${remaining.toFixed(2)} more for FREE shipping!`;
    }
  };

  const getOrderBreakdown = () => {
    const breakdown = [];
    
    if (orderSummary.casesCount > 0) {
      breakdown.push({
        type: 'Cases',
        count: orderSummary.casesCount,
        total: orderSummary.casesTotal,
        display: `${orderSummary.casesCount} case${orderSummary.casesCount === 1 ? '' : 's'} - ${formatCurrency(orderSummary.casesTotal)}`
      });
    }
    
    if (orderSummary.piecesCount > 0) {
      breakdown.push({
        type: 'Pieces',
        count: orderSummary.piecesCount,
        total: orderSummary.piecesTotal,
        display: `${orderSummary.piecesCount} piece${orderSummary.piecesCount === 1 ? '' : 's'} - ${formatCurrency(orderSummary.piecesTotal)}`
      });
    }
    
    return breakdown;
  };

  return {
    // Core data
    processedCartItems: cartItems as ProcessedCartItem[],
    orderSummary,
    isLoading: false,
    
    // Formatted displays
    subtotalDisplay: formatCurrency(orderSummary.subtotal),
    shippingDisplay: orderSummary.shipping === 0 ? "shipping address" : formatCurrency(orderSummary.shipping),
    totalDisplay: formatCurrency(orderSummary.total),
    itemCountDisplay: `${orderSummary.itemCount} ${orderSummary.itemCount === 1 ? 'item' : 'items'}`,
    shippingMessage: getShippingMessage(orderSummary.subtotal),
    
    // Breakdown
    orderBreakdown: getOrderBreakdown(),
    
    // Helper functions
    formatCurrency,
    getShippingMessage
  };
};
