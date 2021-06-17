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

// t_fetchOneClassroom()
// matches with /teacherAPI/classrooms/:classroomId
router.get("/:classroomId", (req, res) => {
  const { classroomId } = req.params;

  model.Classroom.findById(classroomId)
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
      institution:
        institution && institution !== "Elige..." ? institution : undefined,
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

// t_updateClassroomName
// matches with /teacherAPI/classrooms/update/name
router.put("/update/name", async (req, res) => {
  const { classroomId, newName } = req.body;

  try {
    await model.Classroom.findByIdAndUpdate(classroomId, {
      name: newName,
    });

    res
      .status(200)
      .send("Nombre del salón fue actualizado satisfactoriamente.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// t_updateClassroomDescription
// matches with /teacherAPI/classrooms/update/description
router.put("/update/description", async (req, res) => {
  const { classroomId, newDescription } = req.body;

  try {
    await model.Classroom.findByIdAndUpdate(classroomId, {
      description: newDescription,
    });

    res.status(200).send("La descripción fue actualizada satisfactoriamente.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

module.exports = router;
