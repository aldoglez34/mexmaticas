const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  qCounter: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: [
      "Basic",
      "Basic-Intermediate",
      "Intermediate",
      "Intermediate-Advanced",
      "Advanced",
    ],
    required: true,
  },
  examOrderNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  questions: [
    {
      qType: {
        type: String,
      },
      qInstruction: { type: String, required: true },
      qTechnicalInstruction: {
        type: {
          type: String,
          enum: ["text", "image"],
        },
        text: { type: String },
        imageLink: { type: String },
      },
      qMultipleChoice: {
        type: {
          type: String,
          enum: ["text", "image"],
        },
        textChoices: [{ type: String }],
        imageChoices: [{ type: String }],
      },
      qCorrectAnswers: [
        {
          answer: { type: String, required: true },
          complementLeft: { type: String },
          complementRight: { type: String },
        },
      ],
      qComment: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Exam = mongoose.model("Exam", schema);

module.exports = Exam;
