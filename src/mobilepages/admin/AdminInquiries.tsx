import React, { useState, useEffect } from 'react';
import { fetchAllInquiries, markInquiryAsRead, InquiryWithId } from '@/services/inquiryFetch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, Phone, MapPin, Calendar, User, MessageSquare, ChevronLeft } from 'lucide-react';

export const AdminInquiries = (): JSX.Element => {
  const [inquiries, setInquiries] = useState<InquiryWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryWithId | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedInquiries = await fetchAllInquiries();
      setInquiries(fetchedInquiries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
    } finally {
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

  const unreadCount = inquiries.filter(inquiry => !inquiry.read).length;

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Business Inquiries</h1>
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
      <div className="space-y-4 p-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Business Inquiries</h1>
          <p className="text-gray-600">Error loading inquiries</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadInquiries} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Business Inquiries</h1>
            <p className="text-gray-600 text-sm">
              {inquiries.length} total • {unreadCount} unread
            </p>
          </div>
          <Button onClick={loadInquiries} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {selectedInquiry ? (
        /* Inquiry Details View */
        <div className="space-y-4">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setSelectedInquiry(null)}
            className="w-full"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Inquiries List
          </Button>

          {/* Inquiry Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" />
                  {selectedInquiry.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedInquiry.inquiryAbout}
                  </Badge>
                  {!selectedInquiry.read && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsRead(selectedInquiry)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-sm">{selectedInquiry.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-sm">{selectedInquiry.contactNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium text-sm">{formatDate(selectedInquiry.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={selectedInquiry.read ? "secondary" : "default"} className="text-xs">
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
                    <p className="font-medium text-sm">{selectedInquiry.address}</p>
                  </div>
                </div>
              )}

              {/* Questions */}
              {selectedInquiry.questions && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Questions/Message</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedInquiry.questions}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Inquiries List View */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              All Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No inquiries found</p>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inquiry) => (
                  <div
                    key={`${inquiry.month}-${inquiry.id}`}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      inquiry.read
                        ? 'border-gray-200 bg-white'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 text-sm">{inquiry.name}</h3>
                          {!inquiry.read && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{inquiry.inquiryAbout}</p>
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
      )}
    </div>
  );
};

