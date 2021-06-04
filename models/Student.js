const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const schema = new Schema({
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
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
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  exams: [
    {
      type: Schema.Types.ObjectId,
      ref: "Exam",
    },
  ],
  attempts: [
    {
      exam: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
      },
      grade: { type: Number, default: 0 },
      date: { type: Date, default: moment().format() },
    },
  ],
  rewards: [
    {
      topicId: { type: String, required: true },
      name: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],
  perfectGrades: [
    {
      type: Schema.Types.ObjectId,
      ref: "Exam",
    },
  ],
  messages: [
    {
      body: { type: String, required: true },
      answered: { type: Boolean, required: true, default: false },
      response: { type: String, required: true },
      date: { type: Date, default: moment().format() },
    },
  ],
  registeredAt: {
    type: Date,
    default: moment().format(),
  },
  unseenMessages: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Student = mongoose.model("Student", schema);

module.exports = Student;
