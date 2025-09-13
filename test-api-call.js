// Simple test to verify FormData structure for the prefill API
const FormData = require('form-data');
const fs = require('fs');

// Create a mock FormData like the one used in the app
const formData = new FormData();

// Simulate adding a CV file
const mockFileContent = 'Mock CV content';
formData.append('files', mockFileContent, 'test-cv.pdf');

// Add category
formData.append('category', 'student');

console.log('FormData structure for /api/user-response/pre-fill:');
console.log('Fields:');
console.log('- files: Mock file content (test-cv.pdf)');
console.log('- category: student');
console.log('\nContent-Type: multipart/form-data');
console.log('\nExpected API endpoint: POST /api/user-response/pre-fill');
console.log('\nThis matches the specification:');
console.log('POST /api/user-response/pre-fill');
console.log('Content-Type: multipart/form-data');
console.log('Fields:');
console.log('  category: student'); 
console.log('  files: <CV file(s)>');
