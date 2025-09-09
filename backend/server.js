const express = require('express');
const cors = require('cors');
require('./db.cjs'); // Initializes the database

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/auth.cjs'));
app.use('/api/data', require('./routes/data.cjs')); // New routes for user data

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
