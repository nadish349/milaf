import React, { useState, useEffect } from 'react';
import { fetchAllInquiries, markInquiryAsRead, getCurrentMonth, InquiryWithId, InquiryData } from '@/services/inquiryFetch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, Phone, MapPin, Calendar, User, MessageSquare } from 'lucide-react';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';

export const AdminInquiries = (): JSX.Element => {
  const [inquiries, setInquiries] = useState<InquiryWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryWithId | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>("");

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    const setupListener = async () => {
      cleanup = await loadInquiries();
    };
    
    setupListener();
    
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Setting up real-time listener for current month...');
      
      const currentMonthStr = getCurrentMonth();
      setCurrentMonth(currentMonthStr);
      
      // Set up real-time listener
      const inquiriesCollectionRef = collection(db, 'inquiry', currentMonthStr, 'inquiries');
      const q = query(inquiriesCollectionRef, orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const inquiriesData: InquiryWithId[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          inquiriesData.push({
            id: doc.id,
            month: currentMonthStr,
            ...data as InquiryData
          });
        });
        
        console.log('✅ Real-time update: Fetched inquiries:', inquiriesData.length, 'total from', currentMonthStr);
        setInquiries(inquiriesData);
        setLoading(false);
      }, (err) => {
        console.error('❌ Real-time listener error:', err);
        setError('Failed to load inquiries in real-time');
        setLoading(false);
      });
      
      // Cleanup function
      return () => unsubscribe();
    } catch (err) {
      console.error('❌ Error setting up real-time listener:', err);
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
      setLoading(false);
    }
  };


  const handleMarkAsRead = async (inquiry: InquiryWithId) => {
    try {
      await markInquiryAsRead(inquiry.month, inquiry.id);
      setInquiries(prev => 
        prev.map(inq => 
          inq.id === inquiry.id ? { ...inq, read: true } : inq
        )
      );
      if (selectedInquiry?.id === inquiry.id) {
        setSelectedInquiry({ ...inquiry, read: true });
      }
    } catch (err) {
      console.error('Error marking inquiry as read:', err);
    }
  };



  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    try {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Filter out read inquiries - only show unread ones
  const unreadInquiries = inquiries.filter(inquiry => !inquiry.read);
  const unreadCount = unreadInquiries.length;
  const totalCount = inquiries.length; // Total including read ones for reference

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Business Inquiries</h1>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Business Inquiries</h1>
          <p className="text-gray-600">Error loading inquiries</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadInquiries} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Business Inquiries</h1>
            <p className="text-gray-600">
              {unreadCount} unread inquiries from {currentMonth} • {totalCount} total
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Showing only unread inquiries (read inquiries are hidden)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={loadInquiries} variant="outline" size="sm">
              🔄 Refresh
            </Button>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Unread Inquiries ({currentMonth})
                {unreadCount > 0 && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unreadInquiries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {inquiries.length === 0 
                    ? `No inquiries found for ${currentMonth}`
                    : 'No unread inquiries (all have been read)'
                  }
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {unreadInquiries.map((inquiry) => (
                    <div
                      key={`${inquiry.month}-${inquiry.id}`}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedInquiry?.id === inquiry.id
                          ? 'border-green-500 bg-green-50'
                          : inquiry.read
                          ? 'border-gray-200 bg-white'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{inquiry.name}</h3>
                            {!inquiry.read && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{inquiry.inquiryAbout}</p>
                          <p className="text-xs text-gray-500">{formatDate(inquiry.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {inquiry.month}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inquiry Details */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {selectedInquiry.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedInquiry.inquiryAbout}</Badge>
                    {!selectedInquiry.read && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedInquiry)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedInquiry.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedInquiry.contactNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="font-medium">{formatDate(selectedInquiry.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={selectedInquiry.read ? "secondary" : "default"}>
                      {selectedInquiry.read ? "Read" : "Unread"}
                    </Badge>
                  </div>
                </div>

                {/* Address */}
                {selectedInquiry.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="font-medium">{selectedInquiry.address}</p>
                    </div>
                  </div>
                )}

                {/* Questions */}
                {selectedInquiry.questions && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Questions/Message</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.questions}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select an inquiry to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

