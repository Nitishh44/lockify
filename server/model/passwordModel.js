const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const passwordSchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Active'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});



module.exports = mongoose.model('Password', passwordSchema);
