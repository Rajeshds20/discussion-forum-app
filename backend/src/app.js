const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/followers', require('./routes/followerRoutes'));
app.use('/api/discussions', require('./routes/discussionRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/replies', require('./routes/replyRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
