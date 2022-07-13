const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  firstSurname: {
    type: String,
    trim: true,
    required: true,
  },
  secondSurname: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  classrooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
    },
  ],
  messages: [
    {
      sentAt: { type: Date, default: Date.now },
      isResponded: { type: Boolean, default: false },
      isSeen: { type: Boolean, default: false },
      text: { type: String, required: true },
      origin: { type: String, required: true },
      image: { type: String },
      student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Teacher", schema);