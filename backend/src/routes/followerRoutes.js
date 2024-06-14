const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const { followUser, unfollowUser, getFollowers, getFollowing } = require('../controllers/followerController');

router.use(auth);

router.post('/follow/:id', followUser);
router.delete('/unfollow/:id', unfollowUser);
router.get('/followers', getFollowers);
router.get('/following', getFollowing);

module.exports = router;