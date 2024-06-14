const express = require('express');
const router = express.Router();
const { getRepliesFromComment, addReply, deleteReplyById } = require('../controllers/replyController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/:comment_id', getRepliesFromComment);
router.post('/', addReply);
router.delete('/:id', deleteReplyById);

module.exports = router;
