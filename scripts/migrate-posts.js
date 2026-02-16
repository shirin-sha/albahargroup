const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'albahargroup';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function migratePosts() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('posts');

    // Read posts from JSON file
    const postsPath = path.join(__dirname, '../data/posts.json');
    const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

    console.log(`Found ${postsData.length} posts in JSON file`);

    // Check if posts already exist
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Warning: ${existingCount} posts already exist in database.`);
      console.log('Skipping migration to avoid duplicates.');
      console.log('If you want to migrate anyway, delete existing posts first.');
      return;
    }

    // Transform posts data
    const postsToInsert = postsData.map(post => ({
      ...post,
      enabled: true, // Set all existing posts as published
      created_at: post.created_at || new Date().toISOString(),
    }));

    // Insert posts
    const result = await collection.insertMany(postsToInsert);
    console.log(`Successfully migrated ${result.insertedCount} posts to MongoDB`);

  } catch (error) {
    console.error('Error migrating posts:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Migration completed');
  }
}

migratePosts();
