const router = require("express").Router();
const model = require("../../models");

// t_fetchMessages()
// matches with /teacherAPI/messages/all
router.get("/all", function (req, res) {
  model.Message.find()
    .sort({ sentAt: -1 })
    .limit(50)
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_markSeen()
// matches with /teacherAPI/messages/markSeen/:msgId
router.put("/markSeen/:msgId", function (req, res) {
  const msgId = req.params.msgId;

  model.Message.findByIdAndUpdate(msgId, {
    seen: true,
  })
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send({ msg: "Ocurrió un error" });
    });
});

// t_respondMsg()
// matches with /teacherAPI/messages/respond
router.put("/respond", function (req, res) {
  const { email, body, msgId } = req.body;

  // first respond message
  model.Message.findByIdAndUpdate(msgId, {
    response: body,
    answered: true,
    respondedAt: Date.now(),
  })
    .then(() => {
      // after responding, notify student that a new message have been posted
      model.Student.findOneAndUpdate(
        { email: email },
        { $inc: { unseenMessages: 1 } }
      ).then((data) => {
        // send response to the client
        res.json(data);
      });
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send({ msg: "Ocurrió un error" });
    });
});

module.exports = router;
