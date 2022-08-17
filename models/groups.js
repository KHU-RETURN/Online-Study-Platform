const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: String,
    groupDescription: String,
    color: String,
    groupMember: [{
        id: String,
        todo: [{
            text: String,
            checked: Boolean,
        }]
    }],
    calendar: [{
        date: Date,
        title: String,
        content: String,
    }],
    conference: [{
        title: String,
        date: Date,
        record: String,
        chat: [{
            id: String,
            message: String,
            date: Date,
        }]
    }],
    chat: [{
        id: String,
        message: String,
        date: Date,
    }],
    fine: [{
        date: Date,
        id: String,
        fine: Number,
    }],
    todo: [{
        text: String,
        checked: Boolean,
    }]
});

module.exports = mongoose.model('Groups', groupSchema);