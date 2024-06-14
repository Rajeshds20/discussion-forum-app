const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;