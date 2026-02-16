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

async function migrateTeams() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('teams');

    // Read teams from JSON file
    const teamsPath = path.join(__dirname, '../data/teams.json');
    const teamsData = JSON.parse(fs.readFileSync(teamsPath, 'utf8'));

    console.log(`Found ${teamsData.length} team members in JSON file`);

    // Check if teams already exist
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Warning: ${existingCount} team members already exist in database.`);
      console.log('Skipping migration to avoid duplicates.');
      console.log('If you want to migrate anyway, delete existing teams first.');
      return;
    }

    // Transform teams data
    const teamsToInsert = teamsData.map(team => ({
      ...team,
      enabled: true, // Set all existing teams as published
      created_at: team.created_at || new Date().toISOString(),
    }));

    // Insert teams
    const result = await collection.insertMany(teamsToInsert);
    console.log(`Successfully migrated ${result.insertedCount} team members to MongoDB`);

  } catch (error) {
    console.error('Error migrating teams:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Migration completed');
  }
}

migrateTeams();
