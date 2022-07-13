const router = require("express").Router();
const errorLogger = require("../utils/errors");
const model = require("../../models");

// fetchStudents()
// matches with /adminapi/students/all
router.get("/all", function (req, res) {
  model.Student.find({})
    .sort({ name: 1 })
    .select("name firstSurname secondSurname email registeredAt")
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// fetchStudentUnpurchased()
// matches with /adminapi/students/unpurchased/:studentId
router.get("/unpurchased/:studentId", function (req, res) {
  const { studentId } = req.params;

  console.log("ENTERING UNPURCHASED");
  console.log("STUDENTID:", studentId);

  model.Student.findById(studentId)
    .select("courses")
    .then((data) => {
      // this student's courses
      const myCourses = data.courses;

      model.Course.find()
        .select("name")
        .then((allCourses) => {
          res.json(
            allCourses.reduce((acc, cv) => {
              if (!myCourses.includes(cv._id)) acc.push(cv);
              return acc;
            }, [])
          );
        })
        .catch((err) => {
          console.log("@error", err);
          res.status(422).send("Ocurrió un error.");
        });
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// fetchStudentHistory()
// matches with /adminapi/students/history/:studentId
router.get("/history/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const { attempts } = await model.Student.findById(studentId).populate({
      path: "attempts",
      populate: {
        path: "exam course",
        select: "name topics._id topics.name",
      },
    });

    const data = (attempts || []).map((a) => {
      const courseName = a.course?.name;
      const topicName = a.course?.topics?.find(
        ({ _id }) => String(_id) === String(a.topicId)
      )?.name;

      return {
        grade: a.grade,
        date: a.date,
        _id: a._id,
        exam: a.exam?.name,
        courseName,
        topicName,
      };
    });

    return res.json(data);
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// assignCourse()
// matches with /adminapi/students/assignCourse
router.put("/assignCourse", function (req, res) {
  const { studentId, courseId } = req.body;

  // first get all the course's exams
  model.Course.findById(courseId)
    .select("topics.exams")
    .lean()
    .populate("topics.exams", "difficulty")
    .then((data) => {
      const courses = data.topics.reduce((acc, cv) => {
        acc.push(...cv.exams);
        return acc;
      }, []);

      const onlyBasics = courses.reduce((acc, cv) => {
        if (cv.difficulty === "Basic") acc.push(cv._id);
        return acc;
      }, []);

      return onlyBasics;
    })
    .then((onlyBasics) => {
      // insert only basic exams into the student account
      model.Student.findOneAndUpdate(
        { _id: studentId },
        {
          $push: {
            courses: courseId,
            exams: onlyBasics,
          },
        }
      )
        .then((data) => res.json(data))
        .catch((err) => {
          console.log("@error", err);
          res.status(422).send({ msg: "Ocurrió un error" });
        });
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// fetchOneStudent()
// matches with /adminapi/students/:studentId
router.get("/:studentId", function (req, res) {
  const { studentId } = req.params;

  model.Student.findById(studentId)
    .select(
      "email name firstSurname secondSurname registeredAt courses attempts rewards isDeleted"
    )
    .lean() // necessary
    .populate("courses", "name")
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// updateActivityStatus()
// matches with /adminapi/students/update
router.put("/:studentId", function (req, res) {
  const { studentId, isDeleted } = req.body;

  model.Student.findOneAndUpdate({ _id: studentId }, { isDeleted: isDeleted })
    .then((data) => res.json(data))
    .catch((err) => errorLogger(err, res, 422));
});

module.exports = router;
