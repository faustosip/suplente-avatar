const fs = require('fs');
const path = require('path');

console.log('🚀 Dr. Donut Drive-Thru Setup Check');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Please copy .env.example to .env.local and add your API keys\n');
  process.exit(1);
}

// Read environment variables
require('dotenv').config({ path: envPath });

const requiredVars = [
  'NEXT_PUBLIC_VAPI_PUBLIC_KEY',
  'NEXT_PUBLIC_VAPI_ASSISTANT_ID', 
  'NEXT_PUBLIC_SIMLI_API_KEY',
  'NEXT_PUBLIC_SIMLI_FACE_ID'
];

let allConfigured = true;

console.log('📋 Environment Variables Check:');
console.log('--------------------------------');

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value === 'your-' + varName.toLowerCase().replace(/next_public_|_/g, '-') + '-here') {
    console.log(`❌ ${varName}: Not configured`);
    allConfigured = false;
  } else {
    console.log(`✅ ${varName}: Configured (${value.length} chars)`);
  }
});

console.log('\n📦 Dependencies Check:');
console.log('----------------------');

const packageJson = require('./package.json');
const requiredDeps = [
  '@vapi-ai/web',
  'simli-client', 
  'next',
  'react',
  'tailwindcss'
];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}: Installed`);
  } else {
    console.log(`❌ ${dep}: Missing`);
    allConfigured = false;
  }
});

console.log('\n🎯 Configuration Status:');
console.log('-------------------------');

if (allConfigured) {
  console.log('✅ All configurations are complete!');
  console.log('🚀 You can now run: npm run dev');
  console.log('\n📋 Next Steps:');
  console.log('1. Configure your VAPI assistant with the updateOrder function');
  console.log('2. Set up the system prompt in VAPI dashboard');
  console.log('3. Test the avatar and voice functionality');
} else {
  console.log('❌ Configuration incomplete');
  console.log('📝 Please check the items marked with ❌ above');
  console.log('\n📖 Refer to README.md for detailed setup instructions');
}

console.log('\n🔗 Quick Links:');
console.log('- VAPI Dashboard: https://dashboard.vapi.ai');
console.log('- Simli Dashboard: https://app.simli.ai');
console.log('- Documentation: See README.md');
