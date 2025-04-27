require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Item = require('./models/Item');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle lost item submissions
app.post('/api/lost', async (req, res) => {
    try {
        const { name, description, date, location } = req.body;

        const item = new Item({
            name,
            description,
            date,
            location,
            status: 'Lost'
        });

        await item.save(); // Save the item to MongoDB
        res.status(201).json({ message: 'Lost item reported successfully', item });
    } catch (err) {
        console.error('Error saving lost item:', err);
        res.status(500).json({ error: 'Failed to report lost item' });
    }
});

// Route to handle found item submissions
app.post('/api/found', async (req, res) => {
    try {
        const { name, description, date, location } = req.body;

        const item = new Item({
            name,
            description,
            date,
            location,
            status: 'Found'
        });

        await item.save(); // Save the item to MongoDB
        res.status(201).json({ message: 'Found item reported successfully', item });
    } catch (err) {
        console.error('Error saving found item:', err);
        res.status(500).json({ error: 'Failed to report found item' });
    }
});

// Route to fetch all items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find(); // Fetch all items from MongoDB
        res.status(200).json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});