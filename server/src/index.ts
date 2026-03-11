import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://localhost:27017/school_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🍃 Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));