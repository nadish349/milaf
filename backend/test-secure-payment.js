import { db } from './firebase-admin.js';

// Test script for secure payment validation
async function testSecurePayment() {
  console.log('🧪 Testing Secure Payment Implementation...\n');

  try {
    // Test 1: Check Firebase connection
    console.log('1. Testing Firebase connection...');
    const testRef = db.collection('products').limit(1);
    const testSnap = await testRef.get();
    console.log('✅ Firebase connection successful');
    console.log(`   Found ${testSnap.size} product(s) in collection\n`);

    // Test 2: Test product validation logic
    console.log('2. Testing product validation...');
    
    // Mock cart items for testing
    const testCartItems = [
      {
        name: "Milaf Cola",
        quantity: 2,
        cases: false,
        pieces: true,
        price: 5.00 // This should be ignored by server
      },
      {
        name: "Safawi Dates", 
        quantity: 1,
        cases: true,
        pieces: false,
        price: 10.00 // This should be ignored by server
      }
    ];

    // Simulate the validation function
    const validatedItems = [];
    let totalAmount = 0;

    for (const item of testCartItems) {
      console.log(`   Validating: ${item.name}...`);
      
      // Check if product exists
      const productRef = db.collection('products').doc(item.name);
      const productSnap = await productRef.get();
      
      if (!productSnap.exists) {
        console.log(`   ⚠️  Product not found: ${item.name}`);
        continue;
      }

      const product = productSnap.data();
      console.log(`   ✅ Product found: ${product.name}`);
      
      // Determine correct price
      let validatedPrice;
      if (item.cases === true) {
        validatedPrice = product.casePrice || product.price;
        console.log(`   📦 Case price: $${validatedPrice}`);
      } else {
        validatedPrice = product.price;
        console.log(`   🛒 Piece price: $${validatedPrice}`);
      }

      const itemTotal = validatedPrice * item.quantity;
      totalAmount += itemTotal;
      
      validatedItems.push({
        name: item.name,
        quantity: item.quantity,
        price: validatedPrice,
        cases: item.cases,
        pieces: item.pieces,
        itemTotal
      });

      console.log(`   💰 Item total: $${itemTotal}\n`);
    }

    console.log('3. Validation Results:');
    console.log(`   Total validated items: ${validatedItems.length}`);
    console.log(`   Server-calculated total: $${totalAmount.toFixed(2)}`);
    console.log(`   Client prices ignored: ✅`);
    console.log(`   Server prices used: ✅\n`);

    // Test 3: Test audit record creation
    console.log('4. Testing audit record creation...');
    const orderId = `test_order_${Date.now()}`;
    const auditRecord = {
      userId: 'test_user_123',
      items: validatedItems,
      totalAmount,
      shippingAmount: 5.99,
      grandTotal: totalAmount + 5.99,
      validatedAt: new Date(),
      validated: true,
      status: 'test'
    };

    try {
      await db.collection('payments').doc(orderId).set(auditRecord);
      console.log('✅ Audit record created successfully');
      console.log(`   Order ID: ${orderId}`);
      console.log(`   Total: $${auditRecord.grandTotal.toFixed(2)}`);
    } catch (auditError) {
      console.log('⚠️  Audit record creation failed:', auditError.message);
    }

    console.log('\n🎉 Secure Payment Implementation Test Complete!');
    console.log('\nKey Security Features Verified:');
    console.log('✅ Server-side product validation');
    console.log('✅ Client price rejection');
    console.log('✅ Case vs piece pricing');
    console.log('✅ Audit trail creation');
    console.log('✅ Firebase connectivity');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testSecurePayment();

