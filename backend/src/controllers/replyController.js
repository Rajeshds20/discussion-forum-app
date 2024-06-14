const Reply = require('../models/replyModel');
const { replySchema } = require('../middleware/Zodvalidation');
const Comment = require('../models/commentModel');

class ReplyController {

    async getRepliesFromComment(req, res) {
        const { comment_id } = req.params;
        try {
            const comment = await Comment.findById(comment_id);
            if (!comment)
                return res.status(400).json({ msg: 'Comment not found' });

            const replies = await Reply.find({ comment_id }).populate('user_id', 'name');
            res.json(replies);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async addReply(req, res) {
        const { comment_id, text } = req.body;
        try {
            replySchema.parse(req.body);

            const comment = await Comment.find({ comment_id: comment_id });
            if (!comment)
                return res.status(400).json({ msg: 'Comment not found' });

            const newReply = new Reply({ user_id: req.user.id, comment_id, text });
            await newReply.save();
            comment.replies.push(newReply._id);

            res.json(newReply);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async deleteReplyById(req, res) {
        const { id } = req.params;
        try {
            const reply = await Reply.findById(id);
            if (!reply)
                return res.status(400).json({ msg: 'Reply not found' });
            const comment = await Comment.findById(reply.comment_id);
            comment.replies = comment.replies.filter(reply_id => reply_id !== reply._id);
            await comment.save();
            await Reply.findByIdAndDelete(id);
            res.json({ msg: "Reply deleted" });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }
};

module.exports = new ReplyController();