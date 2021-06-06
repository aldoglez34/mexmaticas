const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  source: {
    type: String,
    required: true,
    enum: ["Inicio", "Tema", "Pregunta"],
  },
  seen: {
    type: Boolean,
    required: true,
    default: false,
  },
  answered: {
    type: Boolean,
    required: true,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  subject: {
    type: String,
    trim: true,
    required: true,
  },
  body: {
    type: String,
    trim: true,
  },
  response: {
    type: String,
    trim: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
  },
});

const Message = mongoose.model("Message", schema);

module.exports = Message;
