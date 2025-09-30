const express = require('express');
const cors = require('cors');
const scansRouter = require('./routes/scans');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/scans', scansRouter); // GET /api/scans

// Health check
app.get('/', (req, res) => res.send('Vulnerability scanning server running.'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
