const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://viyass_db_user:WbYxGpDo3FnnwFtP@cluster0.ygeo1xy.mongodb.net/marathonDB?retryWrites=true&w=majority';

async function checkMongoDB() {
  console.log('--------------------------------------------------');
  console.log('Connecting to MongoDB Atlas...');
  console.log('URI:', MONGO_URI.replace(/:([^:@]+)@/, ':****@'));
  console.log('--------------------------------------------------');

  try {
    const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connection Successful!');
    const db = conn.connection.db;
    console.log(`📂 Database Name: ${db.databaseName}`);

    const collections = await db.listCollections().toArray();
    console.log('\n📊 Tables / Collections in database:');
    if (collections.length === 0) {
      console.log('⚠️  No collections found yet in this database.');
    } else {
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(` - Collection (Table): "${col.name}" | Total records: ${count}`);
      }
    }

    const participantsCol = collections.find(c => c.name === 'participants');
    if (participantsCol) {
      console.log('\n🔍 Preview of records in "participants":');
      const docs = await db.collection('participants').find().limit(5).toArray();
      if (docs.length === 0) {
        console.log('   (Collection exists, but has 0 records)');
      } else {
        console.log(JSON.stringify(docs, null, 2));
      }
    } else {
      console.log('\nℹ️ "participants" collection has not been created yet (MongoDB creates collections on the first write/insert).');
    }

    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error('Error Details:', error.message);
    if (error.message.includes('whitelist') || error.message.includes('buffering timed out') || error.message.includes('Server selection timed out')) {
      console.error('\n💡 Note: Check your MongoDB Atlas Network Access whitelist (allow 0.0.0.0/0).');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkMongoDB();
