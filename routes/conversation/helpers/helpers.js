const { isEmpty, isEqual } = require("lodash");
const model = require("../../../models");

const getIdAndModel = (student, teacher) => {
  const id = student || teacher;
  let userModel;
  if (student) userModel = model.Student;
  if (teacher) userModel = model.Teacher;
  return { id, userModel };
};

const getModelByType = (type) => {
  if (type === "student") return model.Student;
  if (type === "teacher") return model.Teacher;
  return null;
};

const getSender = (sender) => ({
  ...(sender.name && { name: sender.name }),
  ...(sender.email && { email: sender.email }),
  ...(sender.student && { student: sender.student }),
  ...(sender.teacher && { teacher: sender.teacher }),
});

const getReceiver = (receiver) => ({
  ...(receiver?.student || receiver?.teacher
    ? {
        ...(receiver.student && { student: receiver.student }),
        ...(receiver.teacher && { teacher: receiver.teacher }),
      }
    : {
        isAdmin: true,
      }),
});

const getLastMessageFromConvo = (conversation) => {
  if (!conversation || !conversation?.messages?.length) return {};
  return conversation.messages.sort((a, b) => b.orderNumber - a.orderNumber)[0];
};

const getIdAndModelOfMessageReceiver = (sentBy, conversation) => {
  const { sender, receiver } = conversation;

  const studentId = sender.student || receiver.student;
  const teacherId = sender.teacher || receiver.teacher;

  if (isEqual(sentBy, studentId)) {
    console.log("STUDENT");
    return {
      messageReceiverId: teacherId,
      messageReceiverModel: model.Teacher,
    };
  }

  if (isEqual(sentBy, teacherId)) {
    console.log("TEACHER");
    return {
      messageReceiverId: studentId,
      messageReceiverModel: model.Student,
    };
  }
};

const buildUnseenConversations = (conversations, pendingMessages) => {
  if (isEmpty(pendingMessages)) return conversations;

  const _conversations = conversations.map((conv) => ({
    ...conv,
    hasPendingMessages: conv.messages.some((msg) =>
      pendingMessages.some((pm) => isEqual(pm, msg._id))
    ),
  }));

  return _conversations;
};

const sortConversationsDesc = (conversations) =>
  conversations.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

module.exports = {
  buildUnseenConversations,
  getIdAndModel,
  getIdAndModelOfMessageReceiver,
  getLastMessageFromConvo,
  getModelByType,
  getReceiver,
  getSender,
  sortConversationsDesc,
};
