const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const schema = new Schema({
  paypalId: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
    enum: ["Primaria", "Secundaria", "Preparatoria", "Universidad"],
  },
  price: {
    type: Number,
    required: true,
  },
  topicsSummary: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  topics: [
    {
      topicOrderNumber: { type: Number, required: true, default: 1 },
      name: { type: String, required: true },
      subject: { type: String, required: true },
      description: { type: String, required: true },
      reward: {
        link: { type: String },
      },
      freestyle: {
        timer: { type: Number, required: true },
        attempts: [
          {
            studentId: {
              type: Schema.Types.ObjectId,
              ref: "Student",
            },
            username: { type: String },
            score: { type: Number, required: true },
            date: { type: Date, default: moment().format() },
          },
        ],
      },
      material: [
        {
          materialOrderNumber: { type: Number, required: true, default: 1 },
          type: { type: String },
          name: { type: String },
          link: { type: String },
        },
      ],
      exams: [
        {
          type: Schema.Types.ObjectId,
          ref: "Exam",
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: moment().format(),
  },
});

const Course = mongoose.model("Course", schema);

module.exports = Course;
