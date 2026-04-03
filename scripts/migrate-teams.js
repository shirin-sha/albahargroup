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

const replaceAll = process.argv.includes('--replace');

async function migrateTeams() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('teams');

    const teamsPath = path.join(__dirname, '../data/teams.json');
    const teamsData = JSON.parse(fs.readFileSync(teamsPath, 'utf8'));

    console.log(`Found ${teamsData.length} team members in data/teams.json`);

    const now = new Date().toISOString();

    if (replaceAll) {
      const deleted = await collection.deleteMany({});
      console.log(`Removed ${deleted.deletedCount} existing team document(s) (--replace)`);
    }

    let inserted = 0;
    let updated = 0;

    for (const team of teamsData) {
      const doc = {
        ...team,
        enabled: team.enabled !== undefined ? team.enabled : true,
        created_at: team.created_at || now,
        updated_at: now,
      };

      const existing = await collection.findOne({ slug: team.slug });
      if (existing) {
        await collection.updateOne(
          { slug: team.slug },
          {
            $set: {
              ...doc,
              created_at: existing.created_at || doc.created_at,
            },
          }
        );
        updated += 1;
      } else {
        await collection.insertOne(doc);
        inserted += 1;
      }
    }

    console.log(
      `Team seed complete: ${inserted} inserted, ${updated} updated (slug match).`
    );
  } catch (error) {
    console.error('Error migrating teams:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

migrateTeams();
