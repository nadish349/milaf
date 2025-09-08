import { db } from '@/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';

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
 * Fetch all inquiries from the current month's collection
 * Collection structure: inquiry -> YYYY-MM -> inquiries -> documentId
 */
export const fetchAllInquiries = async (): Promise<InquiryWithId[]> => {
  try {
    const inquiries: InquiryWithId[] = [];
    
    // Get current month in YYYY-MM format
    const currentMonth = getCurrentMonth();
    console.log(`Fetching inquiries for current month: ${currentMonth}`);
    
    // Get all inquiries from current month
    const inquiriesCollectionRef = collection(db, 'inquiry', currentMonth, 'inquiries');
    const inquiriesSnapshot = await getDocs(
      query(inquiriesCollectionRef, orderBy('createdAt', 'desc'))
    );
    
    console.log(`Found ${inquiriesSnapshot.docs.length} inquiries in ${currentMonth}`);
    
    inquiriesSnapshot.docs.forEach(doc => {
      const data = doc.data() as InquiryData;
      inquiries.push({
        id: doc.id,
        month: currentMonth,
        ...data
      });
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
 * Create a test inquiry to verify the backend is working
 */
export const createTestInquiry = async (): Promise<string> => {
  try {
    console.log('Creating test inquiry...');
    
    const testInquiryData = {
      inquiryAbout: 'Test Inquiry',
      name: 'Test User',
      contactNumber: '+1234567890',
      email: 'test@example.com',
      address: '123 Test Street, Test City',
      questions: 'This is a test inquiry to verify the backend is working correctly.'
    };
    
    // Get current date to create month-based collection path
    const now = new Date();
    const month = now.toISOString().slice(0, 7); // Format: YYYY-MM (e.g., "2024-01")
    
    // Create the collection path: inquiry -> month -> inquiryId
    const monthCollectionRef = collection(db, 'inquiry', month, 'inquiries');
    
    // Prepare the data with additional fields
    const dataToSave = {
      ...testInquiryData,
      read: false,
      createdAt: serverTimestamp()
    };
    
    // Add the document to Firestore
    const docRef = await addDoc(monthCollectionRef, dataToSave);
    
    console.log('✅ Test inquiry created successfully with ID:', docRef.id);
    console.log('✅ Test inquiry saved in month:', month);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating test inquiry:', error);
    throw new Error('Failed to create test inquiry. Please check Firebase connection.');
  }
};

/**
 * Test function to verify Firebase connection and collection structure
 */
export const testInquiryConnection = async (): Promise<void> => {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Test 1: Check if we can access the inquiry collection
    const inquiryCollectionRef = collection(db, 'inquiry');
    const inquirySnapshot = await getDocs(inquiryCollectionRef);
    
    console.log(`✅ Successfully connected to Firebase`);
    console.log(`✅ Found ${inquirySnapshot.docs.length} month collections in inquiry collection`);
    
    if (inquirySnapshot.docs.length === 0) {
      console.log('ℹ️ No month collections found. This is normal if no inquiries have been submitted yet.');
      console.log('💡 Try creating a test inquiry to verify the backend is working.');
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


/**
 * Get a summary of all inquiries in the database
 */
export const getInquirySummary = async (): Promise<{
  totalInquiries: number;
  months: Array<{ month: string; count: number; unread: number }>;
  recentInquiries: InquiryWithId[];
}> => {
  try {
    const allInquiries = await fetchAllInquiries();
    const availableMonths = await getAvailableMonths();
    
    const months = availableMonths.map(month => {
      const monthInquiries = allInquiries.filter(inq => inq.month === month);
      return {
        month,
        count: monthInquiries.length,
        unread: monthInquiries.filter(inq => !inq.read).length
      };
    });
    
    const recentInquiries = allInquiries.slice(0, 5); // Get 5 most recent
    
    return {
      totalInquiries: allInquiries.length,
      months,
      recentInquiries
    };
  } catch (error) {
    console.error('Error getting inquiry summary:', error);
    throw error;
  }
};

/**
 * Debug function to test fetchAllInquiries step by step
 */
export const debugFetchAllInquiries = async (): Promise<void> => {
  try {
    console.log('🔍 DEBUG: Starting fetchAllInquiries debug...');
    
    const inquiries: InquiryWithId[] = [];
    
    // Step 1: Get all months from the inquiry collection
    console.log('📋 Step 1: Getting month collections...');
    const inquiryCollectionRef = collection(db, 'inquiry');
    const inquirySnapshot = await getDocs(inquiryCollectionRef);
    
    console.log(`📊 Found ${inquirySnapshot.docs.length} month collections`);
    console.log('📋 Month collections:', inquirySnapshot.docs.map(doc => doc.id));
    
    if (inquirySnapshot.docs.length === 0) {
      console.log('❌ No month collections found! Database might be empty.');
      return;
    }
    
    // Step 2: For each month, get all inquiries
    for (const monthDoc of inquirySnapshot.docs) {
      const month = monthDoc.id;
      console.log(`📅 Step 2: Processing month: ${month}`);
      
      const inquiriesCollectionRef = collection(db, 'inquiry', month, 'inquiries');
      const inquiriesSnapshot = await getDocs(
        query(inquiriesCollectionRef, orderBy('createdAt', 'desc'))
      );
      
      console.log(`   📝 Found ${inquiriesSnapshot.docs.length} inquiries in ${month}`);
      
      // Step 3: Process each inquiry
      inquiriesSnapshot.docs.forEach((doc, index) => {
        const data = doc.data() as InquiryData;
        console.log(`   📄 Inquiry ${index + 1}:`, {
          id: doc.id,
          month,
          name: data.name,
          email: data.email,
          read: data.read,
          createdAt: data.createdAt
        });
        
        inquiries.push({
          id: doc.id,
          month,
          ...data
        });
      });
    }
    
    // Step 4: Sort and return
    console.log(`📊 Step 3: Sorting ${inquiries.length} total inquiries...`);
    inquiries.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
      }
      return 0;
    });
    
    console.log(`✅ DEBUG COMPLETE: Total inquiries fetched: ${inquiries.length}`);
    console.log('📋 Final inquiries array:', inquiries);
    
  } catch (error) {
    console.error('❌ DEBUG ERROR:', error);
    throw error;
  }
};
