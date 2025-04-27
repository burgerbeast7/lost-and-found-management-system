const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['Lost', 'Found'], required: true }
});

module.exports = mongoose.model('Item', itemSchema);