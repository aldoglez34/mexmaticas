const router = require("express").Router();
const model = require("../../models");
const utils = require("../utils/utils");

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
    .populate("courses", "name school")
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
    // get the courses ids of this classroom
    const coursesIds = await model.Classroom.findById(classroomId)
      .select("courses")
      .then((res) => res.courses);

    // get the basic exams of these courses
    const onlyBasicExamsIds = await utils.getBasicExamsOfAnArrayOfCourses(
      coursesIds
    );

    await utils.pushExamsIntoStudentsAccountsIfTheyDontExist(
      members,
      coursesIds,
      onlyBasicExamsIds
    );

    // update members with new members list
    await model.Classroom.findByIdAndUpdate(classroomId, {
      members,
    });

    res.status(200).send("Los alumnos del salón fueron actualizados.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// t_updateClassroomCourses
// matches with /teacherAPI/classrooms/update/courses
router.put("/update/courses", async (req, res) => {
  const { classroomId, courses } = req.body;

  try {
    // update the courses of the classroom
    await model.Classroom.findByIdAndUpdate(classroomId, {
      courses,
    });

    // out of the courses provided, grab the ids of all the basic exams of all the topics those courses contain
    const onlyBasicExamsIds = await utils.getBasicExamsOfAnArrayOfCourses(
      courses
    );

    // get all the students (members) ids of the classroom
    const membersIds = await model.Classroom.findById(classroomId)
      .select("members")
      .then((res) => res.members);

    await utils.pushExamsIntoStudentsAccountsIfTheyDontExist(
      membersIds,
      courses,
      onlyBasicExamsIds
    );

    res.status(200).send("Los cursos del salón fueron actualizados.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// t_deleteClassroom()
// matches with /teacherAPI/classrooms/delete
router.put("/delete", async (req, res) => {
  const { classroomId } = req.body;

  try {
    // delete the classroom
    await model.Classroom.remove({ _id: classroomId });

    res.status(200).send("El salón fue borrado con éxito.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

// t_fetchClassroomHistory()
// matches with /teacherAPI/classrooms/history/:classroomId
router.get("/history/:classroomId", async (req, res) => {
  const { classroomId } = req.params;

  try {
    // populate two layers deep
    const studentsIds = await model.Classroom.findById(classroomId)
      .select("members")
      .populate({
        path: "members",
        select: "_id attempts name firstSurname secondSurname",
        populate: {
          path: "attempts",
          populate: {
            path: "exam",
            select: "name",
          },
        },
      })
      .then(({ members }) => members);

    const data = studentsIds.reduce((acc, cv) => {
      const student = `${cv.name} ${cv.firstSurname} ${cv.firstSurname}`;

      const history = cv.attempts.map((a) => ({
        student,
        date: a.date,
        exam: a.exam.name,
        grade: a.grade,
      }));

      acc.push(...history);

      return acc;
    }, []);

    res.status(200).send(data);
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

module.exports = router;
