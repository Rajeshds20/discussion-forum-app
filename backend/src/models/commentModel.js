const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    discussion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', required: true },
    text: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
