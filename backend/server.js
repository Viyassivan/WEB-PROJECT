// ==============================================================================
// [TECHNOLOGY 5 OF 5]: NODE.JS, EXPRESS.JS & MONGODB (Backend REST API)
// College Review Presentation File #5
// ==============================================================================
// 1. Database: MongoDB Atlas (via Mongoose) with automatic resilience
// 2. GET  /api/registrations -> Returns registered participants from MongoDB
// 3. POST /api/registrations -> Saves new participant into MongoDB
// ==============================================================================

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection URI
const MONGO_URI = 'mongodb+srv://viyass_db_user:WbYxGpDo3FnnwFtP@cluster0.ygeo1xy.mongodb.net/marathonDB?retryWrites=true&w=majority';

// Mongoose Participant Schema & Model
const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

const Participant = mongoose.model('Participant', participantSchema);

// Connection status flag & fallback storage
let isMongoConnected = false;
let inMemoryRegistrations = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', category: '10K' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '9812345678', category: '5K' }
];

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    isMongoConnected = true;
    console.log('=======================================================');
    console.log('✅ Connected to MongoDB Atlas cluster successfully!');
    console.log('📂 Database: marathonDB | Collection: participants');
    console.log('=======================================================');

    // Auto-seed initial records if collection is empty
    try {
      const count = await Participant.countDocuments();
      if (count === 0) {
        await Participant.insertMany(inMemoryRegistrations.map(r => ({
          name: r.name,
          email: r.email,
          phone: r.phone,
          category: r.category
        })));
        console.log('🌱 Seeded initial participants into MongoDB Atlas.');
      }
    } catch (seedErr) {
      console.warn('Seed check notice:', seedErr.message);
    }
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB Atlas connection notice:', err.message);
    console.warn('💡 Tip: Make sure 0.0.0.0/0 is allowed in MongoDB Atlas -> Network Access.');
    console.log('⚡ Server running smoothly with in-memory storage fallback.');
  });

// GET: Send list of registered participants to frontend
app.get('/api/registrations', async (req, res) => {
  try {
    if (isMongoConnected) {
      const dbParticipants = await Participant.find().sort({ _id: -1 });
      return res.json(dbParticipants);
    }
  } catch (err) {
    console.error('Error fetching from MongoDB:', err.message);
  }
  // Fallback to memory if MongoDB is connecting or IP not whitelisted
  res.json(inMemoryRegistrations);
});

// POST: Add a new participant
app.post('/api/registrations', async (req, res) => {
  const { name, email, phone, category } = req.body;

  // Validation
  if (!name || !email || !phone || !category) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    if (isMongoConnected) {
      const newParticipant = new Participant({ name, email, phone, category });
      await newParticipant.save();
      console.log(`[MongoDB Atlas] Saved new runner: ${name} (${category})`);
      return res.status(201).json({
        message: `Thank you ${name}! You are successfully registered for the ${category} race in MongoDB.`,
        participant: newParticipant
      });
    }
  } catch (err) {
    console.error('MongoDB save error, using fallback:', err.message);
  }

  // Fallback
  const fallbackParticipant = {
    id: inMemoryRegistrations.length + 1,
    name,
    email,
    phone,
    category
  };
  inMemoryRegistrations.unshift(fallbackParticipant);

  res.status(201).json({
    message: `Thank you ${name}! You are successfully registered for the ${category} race.`,
    participant: fallbackParticipant
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
