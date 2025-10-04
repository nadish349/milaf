// Test script for Milaf Arabia Backend API
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Milaf Arabia Backend API...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    console.log('   Status:', healthData.status);
    console.log('   Version:', healthData.version);
    console.log('');

    // Test 2: Get services
    console.log('2️⃣ Testing services endpoint...');
    const servicesResponse = await fetch(`${BASE_URL}/api/services`);
    const servicesData = await servicesResponse.json();
    
    if (servicesData.success) {
      console.log('✅ Services fetched successfully');
      console.log('   Number of services:', servicesData.data.postage_result?.service?.length || 0);
      if (servicesData.data.postage_result?.service?.length > 0) {
        console.log('   First service:', servicesData.data.postage_result.service[0].name);
      }
    } else {
      console.log('❌ Services fetch failed:', servicesData.error);
    }
    console.log('');

    // Test 3: Calculate shipping cost
    console.log('3️⃣ Testing calculate endpoint...');
    const calculateResponse = await fetch(
      `${BASE_URL}/api/calculate?from=3000&to=2000&length=22&width=16&height=7.7&weight=1.5`
    );
    const calculateData = await calculateResponse.json();
    
    if (calculateData.success) {
      console.log('✅ Shipping cost calculated successfully');
      console.log('   From postcode: 3000');
      console.log('   To postcode: 2000');
      console.log('   Package: 22x16x7.7cm, 1.5kg');
      console.log('   Available services:', calculateData.data.postage_result?.service?.length || 0);
      
      if (calculateData.data.postage_result?.service?.length > 0) {
        calculateData.data.postage_result.service.forEach((service, index) => {
          console.log(`   ${index + 1}. ${service.name}: $${service.price}`);
        });
      }
    } else {
      console.log('❌ Calculate failed:', calculateData.error);
    }
    console.log('');

    console.log('🎉 API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm start');
  }
}

// Run the test
testAPI();















