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
            message: String
        }]
    }],
    fine: [{
        date: Date,
        id: String,
    }],
    todo: [{
        text: String,
        checked: Boolean,
    }]
});

module.exports = mongoose.model('Groups', groupSchema);