// Test Firebase service account authentication
import { db, admin } from './firebase-admin.js';

async function testProjectAuth() {
  try {
    console.log('🧪 Testing Firebase service account authentication...');
    
    // Test basic Firestore connection
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('✅ Firestore connection successful');
    
    // Test writing to Firestore
    await db.collection('test').doc('auth-test').set({
      timestamp: new Date(),
      message: 'Project ID authentication working'
    });
    console.log('✅ Firestore write successful');
    
    // Test reading from Firestore
    const testRead = await db.collection('test').doc('auth-test').get();
    if (testRead.exists) {
      console.log('✅ Firestore read successful');
      console.log('📄 Test data:', testRead.data());
    }
    
    // Clean up test data
    await db.collection('test').doc('auth-test').delete();
    console.log('✅ Test cleanup successful');
    
    console.log('🎉 Project ID authentication is working!');
    console.log('🚀 Order creation should work now!');
    
  } catch (error) {
    console.error('❌ Project ID authentication failed:', error.message);
    console.log('💡 You may need to set up Google Cloud credentials');
    console.log('💡 Or use the client SDK approach for testing');
  }
}

testProjectAuth();
