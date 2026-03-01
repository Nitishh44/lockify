const User = require('../model/userModel');
const bcrypt = require('bcrypt');


// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("All fields required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }


    const user = new User({
      name,
      email,
      password: password,
      isVerified: false
    });

    await user.save();

    res.redirect("/login");

  } catch (error) {
    console.error("Signup Error:");
    res.status(500).send("Signup failed");
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('All fields are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    req.session.user = {
      id: user._id,
      email: user.email
    };

    res.redirect('/dashboard');

  } catch (error) {
    console.error(error);
    res.status(500).send('Login failed');
  }
};

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send("User not found");
    }

    if (user.isVerified) {
      return res.redirect("/login");
    }

    if (user.otp !== otp) {
      return res.send("Invalid OTP");
    }

    if (user.otpExpires < Date.now()) {
      return res.send("OTP expired");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.redirect("/login");

  } catch (error) {
    console.error(error);
    res.send("OTP verification failed");
  }
};