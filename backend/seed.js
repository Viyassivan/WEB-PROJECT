const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://viyass_db_user:WbYxGpDo3FnnwFtP@cluster0.ygeo1xy.mongodb.net/marathonDB?retryWrites=true&w=majority';

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

const Participant = mongoose.model('Participant', participantSchema);

const initialParticipants = [
  { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', category: '10K' },
  { name: 'Priya Patel', email: 'priya@example.com', phone: '9812345678', category: '5K' },
  { name: 'Ananya Verma', email: 'ananya@example.com', phone: '9789012345', category: '21K Half Marathon' }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas!');

    const existingCount = await Participant.countDocuments();
    console.log(`Current participant count in MongoDB: ${existingCount}`);

    if (existingCount === 0) {
      console.log('Inserting initial demo participants to create the "participants" collection (table)...');
      await Participant.insertMany(initialParticipants);
      console.log('✅ Successfully created "participants" collection and inserted 3 records!');
    } else {
      console.log('ℹ️ "participants" collection already exists with data.');
    }

    // Verify
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n📊 Collections (Tables) in marathonDB now:');
    for (let c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(` - ${c.name} (${count} documents)`);
    }

  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
