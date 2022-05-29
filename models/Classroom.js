const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  school: {
    type: String,
    enum: ["Primaria", "Secundaria", "Preparatoria", "Universidad"],
  },
  institution: {
    type: Schema.Types.ObjectId,
    ref: "Institution",
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Classroom = mongoose.model("Classroom", schema);

module.exports = Classroom;
