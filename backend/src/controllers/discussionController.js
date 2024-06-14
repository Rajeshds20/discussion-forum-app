const Discussion = require('../models/discussionModel');
const { discussionSchema } = require('../middleware/Zodvalidation');
const axios = require('axios');
// const nodeCache = require('node-cache');

const IMAGE_HANDLER_URL = process.env.IMAGE_HANDLER_URL || "http://localhost:5001";

class DiscussionController {

    async getDiscussions(req, res) {
        const start = req.params.start || 0;
        const limit = req.params.limit || 5;
        try {
            // get only some fields
            // if (nodeCache.has('discussions' + start))
            //     return res.json(nodeCache.get('discussions' + start));
            const discussions = await Discussion.find().select('user_id title image created_on view_count likes').sort({ created_on: -1 }).skip(parseInt(start)).limit(parseInt(limit));
            // nodeCache.set('discussions' + start, discussions, 1000 * 60 * 60);
            res.json(discussions);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async getDiscussionById(req, res) {
        const { id } = req.params;
        try {
            const discussion = await Discussion.findById(id).populate('user_id', 'name email').populate({
                path: 'comments',
                populate: {
                    path: 'user_id',
                    select: 'name email'
                }
            });
            res.json(discussion);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async addDiscussion(req, res) {
        const { title, text, image, hashtags } = req.body;
        try {
            discussionSchema.parse(req.body);

            let imageId = null;
            if (req.file) {
                const formData = new FormData();
                formData.append('image', req.file.buffer, req.file.originalname);

                const response = await axios.post(`${IMAGE_HANDLER_URL}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                imageId = response.data.imageId;
            }

            // const newDiscussion = new Discussion({ user_id: req.user.id, title, text, image, hashtags });
            const newDiscussion = new Discussion({
                user_id: req.user.id,
                title,
                text,
                image: imageId,
                hashtags
            });
            await newDiscussion.save();
            res.json(newDiscussion);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async updateDiscussion(req, res) {
        const { _id, id, title, text, image, hashtags } = req.body;
        try {
            discussionSchema.parse(req.body);
            const discussion = await Discussion.findByIdAndUpdate(id, { title, text, image, hashtags }, { new: true });
            res.json(discussion);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async deleteDiscussionById(req, res) {
        const { id } = req.params;
        try {
            await Discussion.findByIdAndDelete(id);
            res.json({ msg: 'Discussion deleted' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async likeDiscussion(req, res) {
        const { id } = req.params;
        try {
            const discussion = await Discussion.findById(id);
            if (discussion.likes.includes(req.user.id)) return res.status(400).json({ msg: 'Already liked' });

            discussion.likes.push(req.user.id);
            await discussion.save();
            res.json({ msg: 'Liked' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async unlikeDiscussion(req, res) {
        const { id } = req.params;
        try {
            const discussion = await Discussion.findById(id);
            if (!discussion.likes.includes(req.user.id))
                return res.status(400).json({ msg: 'Not liked' });

            discussion.likes = discussion.likes.filter(like => like != req.user.id);
            await discussion.save();
            res.json({ msg: 'Unliked' });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async getTrendingDiscussions(req, res) {
        try {
            const discussions = await Discussion.find().sort({ view_count: -1 }).limit(5);
            res.json(discussions);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async searchDiscussions(req, res) {
        const { query } = req.query;
        try {
            const discussions = await Discussion.find({ $or: [{ title: new RegExp(query, 'i') }, { text: new RegExp(query, 'i') }] });
            res.json(discussions);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async getMyDiscussions(req, res) {
        try {
            const discussions = await Discussion.find({ user_id: req.user.id });
            res.json(discussions);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async getDiscussionsByHashtags(req, res) {
        const { hashtags } = req.query;
        try {
            const discussions = await Discussion.find({ hashtags: { $in: hashtags.split(',') } });
            res.json(discussions);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

    async getDiscussionsByUserId(req, res) {
        const { id } = req.params;
        try {
            const discussions = await Discussion.find({ user_id: id });
            res.json(discussions);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
    }

}

module.exports = new DiscussionController();