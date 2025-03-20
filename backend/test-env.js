const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Current directory:', __dirname);
console.log('Env file path:', path.resolve(__dirname, '.env'));
