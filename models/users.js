const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: String,
    displayName: String,
    photos: String,
    groups: [{
        id: String,
        owner: Boolean,
    }],
    calendar:[{
        date: Date,
        title: String,
        content: String,
    }],
});

module.exports = mongoose.model('Users', userSchema);