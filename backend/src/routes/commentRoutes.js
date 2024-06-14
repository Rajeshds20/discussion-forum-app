const express = require('express');
const router = express.Router();
const { getCommentsFromDiscussion, addComment, deleteCommentById } = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/:discussion_id', getCommentsFromDiscussion);
router.post('/', addComment);
router.delete('/:id', deleteCommentById);

module.exports = router;
