const express = require('express');
const router = express.Router();
const { getUsers, getUserByName, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/', getUsers);
router.get('/search', getUserByName);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;
