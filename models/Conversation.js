const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users = {
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
  },
};

const schema = new Schema({
  origin: {
    type: String,
    trim: true,
  },
  image: { type: String },
  sender: {
    // guest data
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    // if sender is Student or Teacher we populate using this ObjectId
    ...users,
  },
  receiver: {
    isAdmin: {
      type: Boolean,
    },
    ...users,
  },
  isSeenByAdmin: {
    default: false,
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      sentBy: {
        type: Schema.Types.ObjectId,
      },
      orderNumber: {
        type: Number,
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Conversation = mongoose.model("Conversation", schema);

module.exports = Conversation;
