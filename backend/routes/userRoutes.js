const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { register, login, getMe, testConnection } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/test-connection', testConnection);

module.exports = router;