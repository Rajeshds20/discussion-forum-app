const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: String,
    hashtags: [String],
    created_on: { type: Date, default: Date.now },
    view_count: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

// Middleware to update view_count for findOne
discussionSchema.post('findOne', async function (doc) {
    if (doc) {
        doc.view_count += 1;
        await doc.save();
    }
});

// Middleware to update view_count for findById
discussionSchema.post('findById', async function (doc) {
    if (doc) {
        doc.view_count += 1;
        await doc.save();
    }
});

const Discussion = mongoose.model('Discussion', discussionSchema);
module.exports = Discussion;
