// Debug Firebase products collection
import { db, admin } from './firebase-admin.js';

async function debugProducts() {
  try {
    console.log('🔍 Debugging Firebase products collection...');
    
    // Get all products from the collection
    const productsSnapshot = await db.collection('products').get();
    
    console.log(`📦 Found ${productsSnapshot.size} products in Firestore`);
    
    // List all product names
    const productNames = [];
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      productNames.push({
        id: doc.id,
        name: data.name || 'No name field',
        title: data.title || 'No title field',
        category: data.category || 'No category'
      });
    });
    
    console.log('📋 Product List:');
    productNames.forEach((product, index) => {
      console.log(`${index + 1}. ID: "${product.id}" | Name: "${product.name}" | Title: "${product.title}" | Category: "${product.category}"`);
    });
    
    // Check specifically for "khalas dates"
    const khalasVariations = [
      'khalas dates',
      'Khalas dates',
      'Khalas Dates',
      'KHALAS DATES',
      'khalas-dates',
      'khalas_dates'
    ];
    
    console.log('\n🔍 Searching for "khalas dates" variations:');
    for (const variation of khalasVariations) {
      const doc = await db.collection('products').doc(variation).get();
      console.log(`"${variation}": ${doc.exists ? '✅ FOUND' : '❌ NOT FOUND'}`);
    }
    
    // Search for products containing "khalas"
    console.log('\n🔍 Searching for products containing "khalas":');
    const khalasProducts = productNames.filter(p => 
      p.id.toLowerCase().includes('khalas') || 
      p.name.toLowerCase().includes('khalas') ||
      p.title.toLowerCase().includes('khalas')
    );
    
    if (khalasProducts.length > 0) {
      console.log('✅ Found khalas products:');
      khalasProducts.forEach(product => {
        console.log(`  - ID: "${product.id}" | Name: "${product.name}" | Title: "${product.title}"`);
      });
    } else {
      console.log('❌ No products found containing "khalas"');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugProducts();
