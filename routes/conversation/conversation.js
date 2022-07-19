const router = require("express").Router();
const errorLogger = require("../utils/errors");
const model = require("../../models");
const {
  buildUnseenConversations,
  getIdAndModel,
  getModelByType,
  getReceiver,
  getSender,
  sortConversationsDesc,
} = require("./helpers/helpers");
const {
  insertNewPendingMessageIntoReceiver,
  updateOrderNumberForLastMessage,
} = require("./scripts/scripts");

// newConversation()
// matches with /conversationapi/conversations/new
router.post("/new", async (req, res) => {
  const { image, origin, text } = req.body;

  const sender = getSender(req.body.sender);
  const receiver = getReceiver(req.body.receiver);
  const sentBy = sender.student || sender.teacher;

  const isAdmin = receiver.isAdmin;

  try {
    // create new convo and get its _id
    const newConversation = await model.Conversation.create({
      sender,
      receiver,
      origin,
      messages: [{ orderNumber: 1, sentBy, text }],
      ...(isAdmin && { isSeenByAdmin: false }),
      ...(image && { image }),
    });

    // add convo _id to SENDER and RECEIVER if it's not for admin
    // and insert new message into unseen messages for the receiver of the message (not the convo)
    if (!isAdmin) {
      // insert into sender
      const { id: senderId, userModel: senderModel } = getIdAndModel(
        sender.student,
        sender.teacher
      );
      await senderModel.findOneAndUpdate(
        { _id: senderId },
        {
          $push: {
            conversations: newConversation._id,
          },
        }
      );

      // insert into receiver
      const { id: receiverId, userModel: receiverModel } = getIdAndModel(
        receiver.student,
        receiver.teacher
      );
      await receiverModel.findOneAndUpdate(
        { _id: receiverId },
        {
          $push: {
            conversations: newConversation._id,
          },
        }
      );

      await insertNewPendingMessageIntoReceiver(newConversation);
    }

    res.send("Ok");
  } catch (err) {
    errorLogger(err, res, 422);
  }
});

// fetchConversations()
// matches with /conversationapi/conversations/fetch/:useType/:userId
router.get("/fetch/:useType/:userId", async (req, res) => {
  const userModel = getModelByType(req.params.useType);

  const isAdmin =
    req.params.useType === "admin" && req.params.userId === "admin";

  try {
    if (isAdmin) {
      const conversations = await model.Conversation.find({
        "receiver.isAdmin": true,
      });

      res.send(sortConversationsDesc(conversations));
      return;
    }

    const { conversations: _conversations, pendingMessages } = await userModel
      .findById(req.params.userId)
      .lean()
      .select("conversations pendingMessages")
      .populate({
        path: "conversations",
        populate: {
          path: "sender.teacher sender.student receiver.student receiver.teacher",
          select: "name firstSurname secondSurname email",
        },
      });

    const conversations = buildUnseenConversations(
      _conversations,
      pendingMessages
    );

    res.send(sortConversationsDesc(conversations));
  } catch (err) {
    errorLogger(err, res, 422);
  }
});

// newMessage()
// matches with /conversationapi/conversations/message/new
router.put("/message/new", async (req, res) => {
  try {
    // push new message into convo
    const updatedConversation = await model.Conversation.findOneAndUpdate(
      { _id: req.body.conversationId },
      {
        $push: {
          messages: {
            sentBy: req.body.sentBy,
            text: req.body.text,
          },
        },
      },
      { new: true }
    );

    // get new message order number and set it
    const convoAfterOrderNumberUpdate = await updateOrderNumberForLastMessage(
      updatedConversation
    );

    // insert new message's id into pending for the receiver of the message (not the convo)
    await insertNewPendingMessageIntoReceiver(convoAfterOrderNumberUpdate);

    res.send("Ok");
  } catch (err) {
    errorLogger(err);
  }
});

// deleteConversation()
// matches with /conversationapi/conversations/delete/:conversationId
router.put("/delete/:conversationId", async (req, res) => {
  const conversationId = req.params.conversationId;
  try {
    // check if the conversation that we are about to delete has sender/receiver
    const { isAdminConversation, conversation } =
      await model.Conversation.findById(conversationId).then(
        (conversation) => ({
          isAdminConversation: conversation?.receiver?.isAdmin,
          conversation,
        })
      );

    // if it's not admin, then delete the entry for both sender and receiver
    if (!isAdminConversation) {
      // remove conversation from sender
      const { id: senderId, userModel: senderModel } = getIdAndModel(
        conversation?.sender?.student,
        conversation?.sender?.teacher
      );

      await senderModel.updateOne(
        { _id: senderId },
        {
          $pull: {
            conversations: conversation?._id,
          },
        }
      );

      // remove conversation from receiver
      const { id: receiverId, userModel: receiverModel } = getIdAndModel(
        conversation?.receiver?.student,
        conversation?.receiver?.teacher
      );

      await receiverModel.updateOne(
        { _id: receiverId },
        {
          $pull: {
            conversations: conversation?._id,
          },
        }
      );
    }

    // at the end, delete the conversation
    await model.Conversation.deleteOne({
      _id: conversationId,
    });

    res.send("Deleted");
  } catch (err) {
    errorLogger(err);
  }
});

// fetchPendingMessages()
// matches with /conversationapi/conversations/pendingMessages/:userType/:userId
router.get("/pendingMessages/:userType/:userId", async (req, res) => {
  const userModel = getModelByType(req.params.userType);

  const isAdmin =
    req.params.userType === "admin" && req.params.userId === "admin";

  try {
    if (isAdmin) {
      const conversations = await model.Conversation.find({
        "receiver.isAdmin": true,
      });

      res.send(conversations);
      return;
    }

    const { pendingMessages } = await userModel
      .findById(req.params.userId)
      .select("pendingMessages");

    res.send(pendingMessages);
  } catch (err) {
    errorLogger(err, res, 422);
  }
});

// setConversationSeen()
// matches with /conversationapi/conversations/seen/:userType/:userId/:conversationId
router.put("/seen/:userType/:userId/:conversationId", async (req, res) => {
  const isAdmin =
    req.params.userType === "admin" && req.params.userId === "admin";

  try {
    if (isAdmin) {
      await model.Conversation.findOneAndUpdate(
        { _id: req.params.conversationId },
        { $set: { isSeenByAdmin: true } }
      );
      res.send("Ok");
    }

    if (!isAdmin) {
      const userModel = getModelByType(req.params.userType);
      // get this conversation messages
      const { messages } = await model.Conversation.findById(
        req.params.conversationId
      );
      const messsagesIds = messages.map((msg) => msg._id);
      const originalMessagesLength = await userModel
        .findById(req.params.userId)
        .select("pendingMessages")
        .then((pm) => pm.pendingMessages.length);
      // remove these convo's messages from the user's pendingMessages
      const pendingMessagesAfterRemovingSeen = await userModel
        .findOneAndUpdate(
          { _id: req.params.userId },
          {
            $pull: { pendingMessages: { $in: messsagesIds } },
          },
          { new: true }
        )
        .then((user) => user.pendingMessages.length);

      const messagesWereRemoved =
        originalMessagesLength !== pendingMessagesAfterRemovingSeen;

      res.send(messagesWereRemoved);
    }
  } catch (err) {
    errorLogger(err);
  }
});

module.exports = router;
