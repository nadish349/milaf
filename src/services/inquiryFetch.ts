import { db } from '@/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface InquiryData {
  inquiryAbout: string;
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  questions: string;
  read: boolean;
  createdAt: any; // serverTimestamp
}

export interface InquiryWithId extends InquiryData {
  id: string;
  month: string;
}

/**
 * Fetch all inquiries from all months in the inquiry collection
 * Collection structure: inquiry -> YYYY-MM -> inquiries -> documentId
 */
export const fetchAllInquiries = async (): Promise<InquiryWithId[]> => {
  try {
    const inquiries: InquiryWithId[] = [];
    
    // Get all months from the inquiry collection
    const inquiryCollectionRef = collection(db, 'inquiry');
    const inquirySnapshot = await getDocs(inquiryCollectionRef);
    
    console.log(`Found ${inquirySnapshot.docs.length} month collections`);
    
    // For each month, get all inquiries
    for (const monthDoc of inquirySnapshot.docs) {
      const month = monthDoc.id; // This will be like "2025-09", "2025-10", etc.
      console.log(`Fetching inquiries for month: ${month}`);
      
      const inquiriesCollectionRef = collection(db, 'inquiry', month, 'inquiries');
      const inquiriesSnapshot = await getDocs(
        query(inquiriesCollectionRef, orderBy('createdAt', 'desc'))
      );
      
      console.log(`Found ${inquiriesSnapshot.docs.length} inquiries in ${month}`);
      
      inquiriesSnapshot.docs.forEach(doc => {
        const data = doc.data() as InquiryData;
        inquiries.push({
          id: doc.id,
          month,
          ...data
        });
      });
    }
    
    // Sort all inquiries by creation date (newest first)
    inquiries.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
      }
      return 0;
    });
    
    console.log(`Total inquiries fetched: ${inquiries.length}`);
    return inquiries;
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    throw new Error('Failed to fetch inquiries. Please try again.');
  }
};

/**
 * Fetch inquiries for a specific month
 * @param month - Format: YYYY-MM (e.g., "2025-09")
 */
export const fetchInquiriesByMonth = async (month: string): Promise<InquiryWithId[]> => {
  try {
    const inquiries: InquiryWithId[] = [];
    
    console.log(`Fetching inquiries for month: ${month}`);
    
    const inquiriesCollectionRef = collection(db, 'inquiry', month, 'inquiries');
    const inquiriesSnapshot = await getDocs(
      query(inquiriesCollectionRef, orderBy('createdAt', 'desc'))
    );
    
    console.log(`Found ${inquiriesSnapshot.docs.length} inquiries in ${month}`);
    
    inquiriesSnapshot.docs.forEach(doc => {
      const data = doc.data() as InquiryData;
      inquiries.push({
        id: doc.id,
        month,
        ...data
      });
    });
    
    return inquiries;
  } catch (error) {
    console.error(`Error fetching inquiries for month ${month}:`, error);
    throw new Error(`Failed to fetch inquiries for ${month}. Please try again.`);
  }
};

/**
 * Fetch unread inquiries only
 */
export const fetchUnreadInquiries = async (): Promise<InquiryWithId[]> => {
  try {
    const allInquiries = await fetchAllInquiries();
    const unreadInquiries = allInquiries.filter(inquiry => !inquiry.read);
    
    console.log(`Found ${unreadInquiries.length} unread inquiries out of ${allInquiries.length} total`);
    return unreadInquiries;
  } catch (error) {
    console.error('Error fetching unread inquiries:', error);
    throw new Error('Failed to fetch unread inquiries. Please try again.');
  }
};

/**
 * Mark an inquiry as read
 * @param month - The month collection (e.g., "2025-09")
 * @param inquiryId - The document ID of the inquiry
 */
export const markInquiryAsRead = async (month: string, inquiryId: string): Promise<void> => {
  try {
    const inquiryRef = doc(db, 'inquiry', month, 'inquiries', inquiryId);
    await updateDoc(inquiryRef, {
      read: true,
      readAt: serverTimestamp()
    });
    console.log(`Inquiry ${inquiryId} in ${month} marked as read`);
  } catch (error) {
    console.error(`Error marking inquiry ${inquiryId} as read:`, error);
    throw new Error('Failed to mark inquiry as read. Please try again.');
  }
};

/**
 * Get the current month in YYYY-MM format
 */
export const getCurrentMonth = (): string => {
  const now = new Date();
  return now.toISOString().slice(0, 7); // Format: YYYY-MM
};

/**
 * Get all available months that have inquiries
 */
export const getAvailableMonths = async (): Promise<string[]> => {
  try {
    const inquiryCollectionRef = collection(db, 'inquiry');
    const inquirySnapshot = await getDocs(inquiryCollectionRef);
    
    const months = inquirySnapshot.docs.map(doc => doc.id);
    months.sort().reverse(); // Sort newest first
    
    console.log(`Available months: ${months.join(', ')}`);
    return months;
  } catch (error) {
    console.error('Error fetching available months:', error);
    throw new Error('Failed to fetch available months. Please try again.');
  }
};

/**
 * Get inquiry statistics
 */
export const getInquiryStats = async (): Promise<{
  total: number;
  unread: number;
  byMonth: Record<string, { total: number; unread: number }>;
}> => {
  try {
    const allInquiries = await fetchAllInquiries();
    const unreadInquiries = allInquiries.filter(inquiry => !inquiry.read);
    
    const byMonth: Record<string, { total: number; unread: number }> = {};
    
    allInquiries.forEach(inquiry => {
      if (!byMonth[inquiry.month]) {
        byMonth[inquiry.month] = { total: 0, unread: 0 };
      }
      byMonth[inquiry.month].total++;
      if (!inquiry.read) {
        byMonth[inquiry.month].unread++;
      }
    });
    
    const stats = {
      total: allInquiries.length,
      unread: unreadInquiries.length,
      byMonth
    };
    
    console.log('Inquiry statistics:', stats);
    return stats;
  } catch (error) {
    console.error('Error getting inquiry statistics:', error);
    throw new Error('Failed to get inquiry statistics. Please try again.');
  }
};

/**
 * Test function to verify Firebase connection and collection structure
 */
export const testInquiryConnection = async (): Promise<void> => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test 1: Check if we can access the inquiry collection
    const inquiryCollectionRef = collection(db, 'inquiry');
    const inquirySnapshot = await getDocs(inquiryCollectionRef);
    
    console.log(`✅ Successfully connected to Firebase`);
    console.log(`✅ Found ${inquirySnapshot.docs.length} month collections in inquiry collection`);
    
    if (inquirySnapshot.docs.length === 0) {
      console.log('ℹ️ No month collections found. This is normal if no inquiries have been submitted yet.');
      return;
    }
    
    // Test 2: Check each month collection
    for (const monthDoc of inquirySnapshot.docs) {
      const month = monthDoc.id;
      console.log(`📅 Checking month: ${month}`);
      
      const inquiriesCollectionRef = collection(db, 'inquiry', month, 'inquiries');
      const inquiriesSnapshot = await getDocs(inquiriesCollectionRef);
      
      console.log(`   📝 Found ${inquiriesSnapshot.docs.length} inquiries in ${month}`);
      
      // Test 3: Check a sample inquiry document
      if (inquiriesSnapshot.docs.length > 0) {
        const sampleDoc = inquiriesSnapshot.docs[0];
        const sampleData = sampleDoc.data();
        console.log(`   📄 Sample inquiry data:`, {
          id: sampleDoc.id,
          name: sampleData.name,
          email: sampleData.email,
          read: sampleData.read,
          createdAt: sampleData.createdAt
        });
      }
    }
    
    console.log('✅ All tests passed! Firebase connection is working correctly.');
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    throw error;
  }
};
