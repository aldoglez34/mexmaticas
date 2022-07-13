const router = require("express").Router();
const model = require("../../models");
const errorLogger = require("../utils/errors");
const { getFullName } = require("../utils/helpers");

// fetchTeacherMessages()
// matches with /teacherapi/messages/all/:teacherId
router.get("/all/:teacherId", (req, res) =>
  model.Teacher.findById(req.params.teacherId)
    .select("messages")
    .populate({
      path: "messages.student",
      select: "name firstSurname secondSurname email",
    })
    .then((data) => {
      const messages = (data.messages || [])
        .map((msg) => ({
          isResponded: msg.isResponded,
          isSeen: msg.isSeen,
          sentAt: msg.sentAt,
          _id: msg._id,
          origin: msg.origin,
          studentId: msg.student?._id,
          studentEmail: msg.student?.email,
          image: msg.image,
          studentName: getFullName(
            msg?.student?.name,
            msg?.student?.firstSurname,
            msg?.student?.secondSurname
          ),
          text: msg.text,
        }))
        .sort((a, b) => (a.sentAt > b.sentAt ? -1 : 1));
      res.json(messages);
    })
    .catch((err) => errorLogger(err, res, 422))
);

// markTeacherMsgSeen()
// matches with /teacherapi/messages/seen
router.put("/seen", (req, res) => {
  const { teacherId, messageId } = req.body;

  model.Teacher.findOneAndUpdate(
    { _id: teacherId, "messages._id": messageId },
    { $set: { "messages.$.isSeen": true } }
  )
    .then((data) => res.json(data))
    .catch((err) => errorLogger(err, res, 422));
});

module.exports = router;
