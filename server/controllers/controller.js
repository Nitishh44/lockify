const Password = require('../model/passwordModel');
const CryptoJS = require("crypto-js");
const axios = require("axios");

// CREATE password
exports.create = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const encryptedPassword = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.ENCRYPTION_KEY
      ).toString();

    const entry = new Password({
      userId: req.session.user.id,   // 🔑 IMPORTANT
      purpose: req.body.purpose,
      email: req.body.email,
      username: req.body.username,
      password: encryptedPassword,
      status: req.body.status
    });

    await entry.save();
    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    res.send("Error saving password");
  }
};

// GET passwords (dashboard)
exports.find = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized");
    }

    const data = await Password.find({
      userId: req.session.user.id
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Dashboard error");
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Password.findByIdAndUpdate(id, req.body, { new: true });

    if (!data) {
      return res.status(404).send("Entry not found");
    }

    res.send(data);
  } catch (err) {
    res.status(500).send("Update error");
  }
};

// DELETE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Password.findByIdAndDelete(id);
    res.send({ message: "Entry deleted successfully" });
  } catch (err) {
    res.status(500).send("Delete error");
  }
};



exports.showPassword = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized");
    }

    const entry = await Password.findOne({
      _id: req.params.id,
      userId: req.session.user.id
    });
     if (!entry) {
      return res.status(404).send("Not found");
    }

    const bytes = CryptoJS.AES.decrypt(
      entry.password,
      process.env.ENCRYPTION_KEY
    );

    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    res.json({ password: originalPassword });
  }  catch (err) {
    console.error(err);
    res.status(500).send("Error decrypting");
  }
};
