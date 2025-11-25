const express = require('express');
const router = express.Router();
const { registerUser, loginUser,updatePassword } = require('../controllers/userController');
const { sqlPool } = require('../config/database');

//Test for /api/ user route

router.get('/', (req, res) => {
  res.json({ ok: true, message: 'user router alive' });
});


router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/updatepassword', updatePassword);

module.exports = router;