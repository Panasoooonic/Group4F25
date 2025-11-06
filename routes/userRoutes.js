const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { sqlPool } = require('../config/database');

//Test for /api/ user route

router.get('/', (req, res) => {
  res.json({ ok: true, message: 'user router alive' });
});


router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;