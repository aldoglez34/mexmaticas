const router = require("express").Router();
const model = require("../../models");

// t_fetchClassrooms()
// matches with /teacherAPI/classrooms/all
router.get("/all", function (req, res) {
  model.Classroom.find({})
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_newClassroom()
// matches with /teacherAPI/classrooms/new
router.get("/new", function (req, res) {
  //   model.Classroom.find({})
  //     .sort({ name: 1 })
  //     .select("name firstSurname email registeredAt")
  //     .then((data) => res.json(data))
  //     .catch((err) => {
  //       console.log("@error", err);
  //       res.status(422).send("Ocurrió un error.");
  //     });
});

module.exports = router;
