const router = require("express").Router();
const model = require("../../models");
const errorLogger = require("../utils/errors");

// fetchTeacherInfo()
// matches with /teacherapi/teacher/:email
router.get("/:email", (req, res) =>
  model.Teacher.findOne({ email: req.params.email })
    .then((data) => {
      const teacher = {
        _id: data._id,
        email: data.email,
        firebaseUID: data.firebaseUID,
        name: data.name,
        fullName: `${data.name} ${data.firstSurname} ${data.secondSurname}`,
      };
      res.json(teacher);
    })
    .catch((err) => errorLogger(err, res, 422))
);

module.exports = router;
