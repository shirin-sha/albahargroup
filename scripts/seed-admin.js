const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('❌ Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function seedAdmin() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Default admin credentials
    const adminUsername = 'admin';
    const adminPassword = 'admin123';
    const adminEmail = 'admin@albahargroup.com';

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ 
      $or: [
        { username: adminUsername },
        { email: adminEmail }
      ]
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const adminUser = {
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(adminUser);

    if (result.insertedId) {
      console.log('✅ Admin user seeded successfully!');
      console.log('📋 Admin Credentials:');
      console.log(`   Username: ${adminUsername}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Role: admin`);
      console.log(`   ID: ${result.insertedId}`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
}

seedAdmin();
