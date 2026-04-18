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

async function migrateProjects() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('projects');

    // Read projects from JSON file
    const projectsPath = path.join(__dirname, '../data/projects.json');
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

    console.log(`Found ${projectsData.length} projects in JSON file`);

    // Check if projects already exist
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Warning: ${existingCount} projects already exist in database.`);
      console.log('Skipping migration to avoid duplicates.');
      console.log('If you want to migrate anyway, delete existing projects first.');
      return;
    }

    const projectsToInsert = projectsData.map((project) => ({
      title: project.title || '',
      titleAr: project.titleAr || '',
      description: project.description || '',
      descriptionAr: project.descriptionAr || '',
      image: project.image || '',
    }));

    // Insert projects
    const result = await collection.insertMany(projectsToInsert);
    console.log(`Successfully migrated ${result.insertedCount} projects to MongoDB`);

  } catch (error) {
    console.error('Error migrating projects:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Migration completed');
  }
}

migrateProjects();
