const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
    enum: ["Primaria", "Secundaria", "Preparatoria", "Universidad"],
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  createdAt: {
    type: Date,
    default: moment().format(),
  },
});

const Classroom = mongoose.model("Classroom", schema);

module.exports = Classroom;
