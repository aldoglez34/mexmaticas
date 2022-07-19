import { useMemo } from "react";
import { isEmpty, isEqual } from "lodash";
import { getFullName } from "../utils/helpers";

const getPreviewData = (conversation) => {
  const lastMessage = conversation.messages.sort(
    (a, b) => b.orderNumber - a.orderNumber
  )[0];

  if (!lastMessage) return {};

  const student =
    conversation.sender?.student || conversation.reciever?.student;

  const studentName = getFullName(
    student.name,
    student.firstSurname,
    student.secondSurname
  );

  return {
    studentName,
    studentEmail: student.email,
    title: `${studentName} - ${conversation.origin}`,
    body: lastMessage.text,
    ...(conversation.email && { image: conversation.email }),
  };
};

const getUserType = (user) => {
  if (!user) return null;
  if (user.student) return "student";
  if (user.teacher) return "teacher";
  return null;
};

const getOwner = (sentBy, sender, receiver, matches = true) => {
  if (!sentBy || !sender || !receiver) return null;

  // returns sender/receiver that matches sentBy
  if (matches) {
    if (isEqual(sentBy, sender._id)) return sender;
    if (isEqual(sentBy, receiver._id)) return receiver;
  }

  // returns sender/receiver that does not match sentBy
  if (!matches) {
    if (!isEqual(sentBy, sender._id)) return sender;
    if (!isEqual(sentBy, receiver._id)) return receiver;
  }

  return {};
};

const getUserValues = (user) => {
  if (!user) return null;
  const userType = getUserType(user);
  return {
    _id: user[userType]._id,
    name: getFullName(
      user[userType].name,
      user[userType].firstSurname,
      user[userType].secondSurname
    ),
    email: user[userType].email,
    type: "student",
  };
};

const getSenderAndReceiver = (conversation) => {
  const { sender: _sender, receiver: _receiver } = conversation || {};
  if (!_sender || !_receiver) return null;

  const sender = getUserValues(_sender);
  const receiver = getUserValues(_receiver);

  return { sender, receiver };
};

export const useConversations = (conversations, myId) => {
  const formattedConversations = useMemo(() => {
    if (!conversations) return null;
    if (isEmpty(conversations)) return [];

    const _conversations = conversations.map((conv) => {
      const { sender, receiver } = getSenderAndReceiver(conv);

      const _messages = (conv.messages || []).map((msg) => ({
        ...msg,
        author: getOwner(msg.sentBy, sender, receiver),
        isOwnMessage: isEqual(myId, msg.sentBy),
      }));

      return {
        ...conv,
        ...getPreviewData(conv),
        messages: _messages,
        partner: { ...getOwner(myId, sender, receiver, false) },
        receiver,
        sender,
      };
    });

    return _conversations.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  }, [conversations, myId]);

  return { formattedConversations };
};
