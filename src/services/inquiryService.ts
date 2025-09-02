import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';

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

export const saveInquiry = async (inquiryData: Omit<InquiryData, 'read' | 'createdAt'>): Promise<string> => {
  try {
    // Get current date to create month-based collection path
    const now = new Date();
    const month = now.toISOString().slice(0, 7); // Format: YYYY-MM (e.g., "2024-01")
    
    // Create the collection path: inquiry -> month -> inquiryId
    const monthCollectionRef = collection(db, 'inquiry', month, 'inquiries');
    
    // Prepare the data with additional fields
    const dataToSave: InquiryData = {
      ...inquiryData,
      read: false,
      createdAt: serverTimestamp()
    };
    
    // Add the document to Firestore
    const docRef = await addDoc(monthCollectionRef, dataToSave);
    
    console.log('Inquiry saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving inquiry:', error);
    throw new Error('Failed to save inquiry. Please try again.');
  }
};

export const fetchAllInquiries = async (): Promise<InquiryWithId[]> => {
  try {
    const inquiries: InquiryWithId[] = [];
    
    // Get all months from the inquiry collection
    const inquiryCollectionRef = collection(db, 'inquiry');
    const inquirySnapshot = await getDocs(inquiryCollectionRef);
    
    // For each month, get all inquiries
    for (const monthDoc of inquirySnapshot.docs) {
      const month = monthDoc.id;
      const inquiriesCollectionRef = collection(db, 'inquiry', month, 'inquiries');
      const inquiriesSnapshot = await getDocs(query(inquiriesCollectionRef, orderBy('createdAt', 'desc')));
      
      inquiriesSnapshot.docs.forEach(doc => {
        inquiries.push({
          id: doc.id,
          month,
          ...doc.data() as InquiryData
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
    
    console.log('Fetched inquiries:', inquiries.length);
    return inquiries;
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    throw new Error('Failed to fetch inquiries. Please try again.');
  }
};

export const markInquiryAsRead = async (month: string, inquiryId: string): Promise<void> => {
  try {
    const inquiryRef = doc(db, 'inquiry', month, 'inquiries', inquiryId);
    await updateDoc(inquiryRef, {
      read: true
    });
    console.log('Inquiry marked as read:', inquiryId);
  } catch (error) {
    console.error('Error marking inquiry as read:', error);
    throw new Error('Failed to mark inquiry as read. Please try again.');
  }
};
