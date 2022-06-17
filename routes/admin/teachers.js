const router = require("express").Router();
const model = require("../../models");

// fetchTeachers()
// matches with /adminapi/teachers/all
router.get("/all", (req, res) => {
  model.Teacher.find({})
    .populate("classroom", "name")
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// registerNewTeacher()
// matches with /adminapi/teachers/new
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

// fetchAvailableTeachers()
// matches with /adminapi/teachers/available
router.get("/available", (req, res) => {
  model.Teacher.find({})
    .then((data) => {
      const response = data.map(
        ({ name, firstSurname, secondSurname, _id }) => ({
          fullName: `${name} ${firstSurname} ${secondSurname}`,
          _id,
        })
      );
      res.json(response);
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// assignTeacher()
// matches with /adminapi/teachers/assign
router.put("/assign", async (req, res) => {
  const { classroomId, currentTeacherId, newTeacherId } = req.body;

  try {
    // if by accident user tries to set the same teacher don't do anything
    if (currentTeacherId === newTeacherId) {
      res.send("El maestro fue borrado con éxito.");
      return;
    }

    // clear current's teacher classroom unless it's the first assignation
    const isFirstAssignationOfTeacher =
      currentTeacherId === "" || currentTeacherId === "Elige...";
    if (!isFirstAssignationOfTeacher) {
      await model.Teacher.findOneAndUpdate(
        { _id: currentTeacherId },
        {
          $unset: {
            classroom: null,
          },
        }
      );
    }

    // if the newTeacherId is empty string means that user just unassigned the classroom to the currentTeacher
    if (newTeacherId === "") {
      // clear classroom's teacher
      await model.Classroom.findOneAndUpdate(
        { _id: classroomId },
        {
          $unset: {
            teacher: null,
          },
        }
      );
      res.send("El maestro fue borrado con éxito.");
      return;
    }

    if (newTeacherId !== "") {
      // proceed to set the values
      await model.Teacher.findOneAndUpdate(
        { _id: newTeacherId },
        {
          $set: {
            classroom: classroomId,
          },
        }
      );

      await model.Classroom.findOneAndUpdate(
        { _id: classroomId },
        {
          $set: {
            teacher: newTeacherId,
          },
        }
      );
    }

    res.send("El maestro fue asignado con éxito.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// fetchOneTeacher()
// matches with /adminapi/teachers/:teacherId
router.get("/:teacherId", function (req, res) {
  const { teacherId } = req.params;

  model.Teacher.findById(teacherId)
    .select("name firstSurname secondSurname email createdAt classroom")
    .populate({
      path: "classroom",
      select: "name school description courses members",
      populate: {
        path: "courses members",
        select: "name firstSurname secondSurname email",
      },
    })
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

module.exports = router;
