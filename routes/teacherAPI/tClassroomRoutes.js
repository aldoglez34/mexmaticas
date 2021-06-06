const router = require("express").Router();
const model = require("../../models");

// t_fetchClassrooms()
// matches with /teacherAPI/classrooms/all
router.get("/all", (req, res) => {
  model.Classroom.find({})
    .lean()
    .populate("institution", "name")
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_newClassroom()
// matches with /teacherAPI/classrooms/new
router.post("/new", async (req, res) => {
  const { description, institution, name, school } = req.body;

  try {
    await model.Classroom.create({
      name: name.trim(),
      institution: institution ? institution : undefined,
      school: school ? school : undefined,
      description: String(description).trim().length
        ? description.trim()
        : undefined,
    }).then((res) => res);

    res.status(200).send("Se creó el salón de manera satisfactoria.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

module.exports = router;
