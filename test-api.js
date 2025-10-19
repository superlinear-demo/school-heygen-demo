// Simple test script for API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testFormSubmission() {
  try {
    const formData = {
      step1: {
        parentName: 'John Doe',
        studentName: 'Jane Doe',
        studentAge: 8
      },
      step2: {
        currentGrade: 'Grade 3',
        currentSchool: 'ABC School',
        placeOfStudy: 'Dubai',
        areaOfInterest: 'Science & Technology'
      },
      step3: {
        phoneNumber: '919538055505',
        message: 'Interested in admission for my daughter'
      }
    };

    console.log('Testing form submission...');
    const response = await axios.post(`${BASE_URL}/api/submit-form`, formData);
    console.log('Form submission response:', response.data);
    
    return response.data.formId;
  } catch (error) {
    console.error('Form submission test failed:', error.response?.data || error.message);
  }
}

async function testHeyGenCallback(formId) {
  try {
    const callbackData = {
      video_id: 'test_video_123',
      status: 'completed',
      video_url: 'https://example.com/test-video.mp4'
    };

    console.log('Testing HeyGen callback...');
    const response = await axios.post(`${BASE_URL}/api/heygen-callback`, callbackData);
    console.log('Callback response:', response.data);
  } catch (error) {
    console.error('Callback test failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('Starting API tests...\n');
  
  const formId = await testFormSubmission();
  
  if (formId) {
    console.log('\n---\n');
    await testHeyGenCallback(formId);
  }
  
  console.log('\nTests completed.');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testFormSubmission, testHeyGenCallback };
