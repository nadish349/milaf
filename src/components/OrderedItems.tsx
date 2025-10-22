import React, { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Calendar } from 'lucide-react';

const OrderedItems: React.FC = () => {
  const { orderedItems, loadOrderedItems, isCartLoading } = useCart();

  useEffect(() => {
    loadOrderedItems();
  }, [loadOrderedItems]);

  if (isCartLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orderedItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Ordered Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No ordered items yet.</p>
            <p className="text-sm">Your completed orders will appear here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Ordered Items ({orderedItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orderedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-green-800">{item.name}</h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Paid
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-green-700">
                  <span>Quantity: {item.quantity}</span>
                  <span>•</span>
                  <span>
                    {item.cases ? 'Cases' : item.pieces ? 'Pieces' : 'Units'}
                  </span>
                  <span>•</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                
                {item.category && (
                  <div className="text-xs text-green-600 mt-1">
                    Category: {item.category}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-lg font-semibold text-green-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div className="text-xs text-green-600">
                  ${item.price.toFixed(2)} each
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium text-green-800">Total Ordered:</span>
            <span className="text-lg font-semibold text-green-800">
              ${orderedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderedItems;
