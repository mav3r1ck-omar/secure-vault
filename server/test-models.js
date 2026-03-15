const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');
const AuditLog = require('./models/AuditLog');
const Document = require('./models/Document');

connectDB();

console.log('✅ All models loaded successfully!');
console.log('📦 User model:', User.modelName);
console.log('📦 AuditLog model:', AuditLog.modelName);
console.log('📦 Document model:', Document.modelName);

process.exit(0);