const Comment = require('../models/commentModel');
const Discussion = require('../models/discussionModel');
const { commentSchema } = require('../middleware/Zodvalidation');
const Reply = require('../models/replyModel');

class CommentController {

    async getCommentsFromDiscussion(req, res) {
        const { discussion_id } = req.params;
        try {
            const comments = await Comment.find({ discussion_id }).populate('user_id', 'name');
            res.json(comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async addComment(req, res) {
        const { discussion_id, text } = req.body;
        try {
            commentSchema.parse(req.body);

            const discussion = await Discussion.find({ discussion_id: discussion_id });
            if (!discussion)
                return res.status(400).json({ msg: 'Discussion not found' });

            const newComment = new Comment({ user_id: req.user.id, discussion_id, text });
            await newComment.save();
            discussion.comments.push(newComment._id);
            await discussion.save();

            res.json(newComment);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async deleteCommentById(req, res) {
        const { id } = req.params;
        try {
            await Comment.findByIdAndDelete(id);
            res.json({ msg: "Comment deleted" });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }
}

module.exports = new CommentController();