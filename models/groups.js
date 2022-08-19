const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: String,
    groupDescription: String,
    color: String,
    groupMember: [{
        id: String,
        todo: [{
            text: String,
            date: String,
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
        record: [],
        startTime: Date,
        endTime: Date,
    }],
    chat: [{
        id: String,
        message: String,
        date: Date,
    }],
    fine: [{
        date: Date,
        id: String,
        amount: Number,
    }],
    todo: [{
        text: String,
        checked: Boolean,
    }]
});

module.exports = mongoose.model('Groups', groupSchema);