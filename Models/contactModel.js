const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    contactTo: {
      type: String,
      required: true,
      trim: true,
    },

    reference:{
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,

    },
    recentMsg: {
      type: String,
      trim: true,
      default: '',
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);












module.exports = mongoose.model('Contact', contactSchema);
