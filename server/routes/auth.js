const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', authController.signup);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', authController.login);

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err){
      console.log(err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

router.get("/verify-otp", (req, res) => {
  res.render("verify-otp", { email: req.query.email });
});
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
