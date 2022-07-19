const model = require("../../../models");
const errorLogger = require("../../utils/errors");
const {
  getIdAndModelOfMessageReceiver,
  getLastMessageFromConvo,
} = require("../helpers/helpers");

const insertNewPendingMessageIntoReceiver = (conversation) => {
  return new Promise((res, rej) => {
    try {
      const { _id: messageId, sentBy } = getLastMessageFromConvo(conversation);
      const { messageReceiverId, messageReceiverModel } =
        getIdAndModelOfMessageReceiver(sentBy, conversation);

      messageReceiverModel
        .findOneAndUpdate(
          { _id: messageReceiverId },
          { $push: { pendingMessages: messageId } }
        )
        .then(() => res())
        .catch(() => rej());
    } catch (err) {
      errorLogger(err);
    }
  });
};

const updateOrderNumberForLastMessage = (conversation) => {
  return new Promise((res, rej) => {
    try {
      const nextOrderNumber = conversation.messages.length;
      const { _id: lastMessageId } = conversation.messages[nextOrderNumber - 1];
      model.Conversation.findOneAndUpdate(
        { _id: conversation._id, "messages._id": lastMessageId },
        { $set: { "messages.$.orderNumber": nextOrderNumber } },
        { new: true }
      )
        .then((updatedConversation) => res(updatedConversation))
        .catch(() => rej());
    } catch (err) {
      errorLogger(err);
    }
  });
};

module.exports = {
  insertNewPendingMessageIntoReceiver,
  updateOrderNumberForLastMessage,
};
