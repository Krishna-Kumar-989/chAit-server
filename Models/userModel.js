const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true,
      trim: true
  },
  phone: {
      type: String,
      required: true,
      trim: true
  },
  password: {
      type: String,
      required: true
  },
  image: {
      type: String,  // This will store the image URL or path
      default: ''
  }
});

module.exports = mongoose.model("User",userSchema);