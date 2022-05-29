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
  classrooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Institution = mongoose.model("Institution", schema);

module.exports = Institution;
