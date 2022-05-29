const router = require("express").Router();
const model = require("../../models");
const {
  getBasicExamsOfAnArrayOfCourses,
  pushExamsIntoStudentsAccountsIfTheyDontExist,
} = require("../utils/helpers");

// fetchClassrooms()
// matches with matches with /adminapi/classrooms/all
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

// fetchOneClassroom()
// matches with /adminapi/classrooms/:classroomId
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

// fetchClassroomHistory()
// matches with /adminapi/classrooms/history/:classroomId
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
            path: "exam course",
            select: "name topics._id topics.name",
          },
        },
      })
      .then(({ members }) => members);

    const data = studentsIds.reduce((acc, cv) => {
      const student = `${cv.name} ${cv.firstSurname} ${cv.firstSurname}`;

      const history = cv.attempts.map((a) => {
        const topicName = a.course?.topics?.find(
          ({ _id }) => String(_id) === String(a.topicId)
        )?.name;

        return {
          course: a.course?.name,
          date: a.date,
          exam: a.exam.name,
          grade: a.grade,
          student,
          topic: topicName,
        };
      });

      acc.push(...history);

      return acc;
    }, []);

    res.status(200).send(data);
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// newClassroom()
// matches with /adminapi/classrooms/new
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

// updateClassroomName()
// matches with /adminapi/classrooms/update/name
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

// updateClassroomDescription()
// matches with /adminapi/classrooms/update/description
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

// updateClassroomSchool()
// matches with /adminapi/classrooms/update/school
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

// updateClassroomInstitution()
// matches with /adminapi/classrooms/update/institution
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

// updateClassroomMembers()
// matches with /adminapi/classrooms/update/members
router.put("/update/members", async (req, res) => {
  const { classroomId, members } = req.body;

  try {
    // get the courses ids of this classroom
    const coursesIds = await model.Classroom.findById(classroomId)
      .select("courses")
      .then((res) => res.courses);

    // get the basic exams of these courses
    const onlyBasicExamsIds = await getBasicExamsOfAnArrayOfCourses(coursesIds);

    await pushExamsIntoStudentsAccountsIfTheyDontExist(
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

// updateClassroomCourses()
// matches with /adminapi/classrooms/update/courses
router.put("/update/courses", async (req, res) => {
  const { classroomId, courses } = req.body;

  try {
    // update the courses of the classroom
    await model.Classroom.findByIdAndUpdate(classroomId, {
      courses,
    });

    // out of the courses provided, grab the ids of all the basic exams of all the topics those courses contain
    const onlyBasicExamsIds = await getBasicExamsOfAnArrayOfCourses(courses);

    // get all the students (members) ids of the classroom
    const membersIds = await model.Classroom.findById(classroomId)
      .select("members")
      .then((res) => res.members);

    await pushExamsIntoStudentsAccountsIfTheyDontExist(
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

// deleteClassroom()
// matches with /adminapi/classrooms/delete
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

module.exports = router;
