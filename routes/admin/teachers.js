const router = require("express").Router();
const model = require("../../models");

// fetchTeachers()
// matches with matches with /adminapi/teachers/all
router.get("/all", (req, res) => {
  model.Teacher.find({})
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// registerNewTeacher()
// matches with matches with /adminapi/teachers/new
router.post("/new", async (req, res) => {
  model.Teacher.create({
    firebaseUID: req.body.firebaseUID,
    name: req.body.name,
    firstSurname: req.body.firstSurname,
    secondSurname: req.body.secondSurname,
    email: req.body.email,
  })
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

module.exports = router;
