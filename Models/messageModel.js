const mongoose = require('mongoose');


function generateMessageId() {
  return 'MSG-' + Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 999999
}

// Define the schema
const messageSchema = new mongoose.Schema(
  {
    messageId: { 
      type: String, 
      required: true, 
      unique: true, 
      default: generateMessageId // Automatically generate a messageId when creating a new document
    },
    messagetype: {
      type: String,
      required: true,
      trim: true,
      default: 'text',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      type: String,
      required: true,
      trim: true,
    },
    reciever: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);


// Create and export the model
module.exports = mongoose.model('Messagemod', messageSchema);
