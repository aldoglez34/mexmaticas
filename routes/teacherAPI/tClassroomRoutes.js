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
    .populate("institution", "name")
    .populate("members", "name email firstSurname secondSurname")
    .populate("courses", "name")
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

// t_updateClassroomSchool
// matches with /teacherAPI/classrooms/update/school
router.put("/update/school", async (req, res) => {
  const { classroomId, newSchool } = req.body;

  try {
    await model.Classroom.findByIdAndUpdate(classroomId, {
      school: newSchool && newSchool !== "Elige..." ? newSchool : undefined,
    });

    res
      .status(200)
      .send("El nivel educativo fue actualizado satisfactoriamente.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// t_updateClassroomInstitution
// matches with /teacherAPI/classrooms/update/institution
router.put("/update/institution", async (req, res) => {
  const { classroomId, newInstitution } = req.body;

  try {
    await model.Classroom.findByIdAndUpdate(classroomId, {
      institution:
        newInstitution && newInstitution !== "Elige..."
          ? newInstitution
          : undefined,
    });

    res
      .status(200)
      .send("El nivel educativo fue actualizado satisfactoriamente.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// t_updateClassroomMembers
// matches with /teacherAPI/classrooms/update/members
router.put("/update/members", async (req, res) => {
  const { classroomId, members } = req.body;

  try {
    await model.Classroom.findByIdAndUpdate(classroomId, {
      members,
    });

    res.status(200).send("Los alumnos del curso fueron actualizados.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

module.exports = router;
