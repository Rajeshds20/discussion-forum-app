const express = require('express');
const router = express.Router();
const { getDiscussions, getDiscussionById, addDiscussion, updateDiscussion, deleteDiscussionById, likeDiscussion, unlikeDiscussion, getTrendingDiscussions, searchDiscussions, getMyDiscussions, getDiscussionsByHashtags, getDiscussionsByUserId } = require('../controllers/discussionController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

router.use(auth);

const upload = multer({ Storage: multer.memoryStorage() });

router.get('/', getDiscussions);
router.get('/get/:id', getDiscussionById);
router.post('/', upload.single('image'), addDiscussion);
router.put('/:id', upload.single('image'), updateDiscussion);
router.delete('/:id', deleteDiscussionById);
router.get('/like/:id', likeDiscussion);
router.get('/unlike/:id', unlikeDiscussion);
router.get('/trending', getTrendingDiscussions);
router.get('/search', searchDiscussions);
router.get('/my', getMyDiscussions);
router.get('/hashtags', getDiscussionsByHashtags);
router.get('/user', getDiscussionsByUserId);

module.exports = router;
