const router = require("express").Router();
const model = require("../../models");

// fetchCourseInfo()
// matches with /api/course/info/:courseId/:studentId
router.get("/info/:courseId/:studentId", function (req, res) {
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;

  let courseData = {};

  // 1. first get the course data
  model.Course.findById(courseId)
    .lean()
    .select(
      "name topics._id topics.subject topics.name topics.topicOrderNumber topics.description topics.freestyle topics.material topics.exams topics.reward"
    )
    .populate(
      "topics.exams",
      "_id name description duration difficulty qCounter examOrderNumber questions"
    )
    .then((data) => {
      courseData = data;

      // 2. then get the student data
      return model.Student.findById(studentId).select(
        "exams attempts rewards perfectGrades"
      );
    })
    .then((data) => {
      const studentData = data;

      courseData.rewards = courseData.topics.reduce((acc, cv) => {
        acc.push({
          medalName: `Medalla de ${cv.name}`,
          link: cv.reward.link,
          hasReward: studentData.rewards.filter(
            (r) => String(r.topicId) === String(cv._id)
          ).length
            ? true
            : false,
        });

        return acc;
      }, []);

      // 3. combine both results and send to client
      return {
        ...courseData,
        // topics reduce
        topics: courseData.topics.reduce((acc, cv) => {
          acc.push({
            ...cv,
            freestyle: {
              ...cv.freestyle,
              lastVisit: cv.freestyle.attempts
                .filter((a) => a.studentId.toString() === studentId.toString())
                .sort((a, b) => (a.date > b.date ? -1 : 1))[0]
                ? cv.freestyle.attempts
                    .filter(
                      (a) => a.studentId.toString() === studentId.toString()
                    )
                    .sort((a, b) => (a.date > b.date ? -1 : 1))[0].date
                : null,
              myHighestScore: cv.freestyle.attempts
                .filter((a) => a.studentId.toString() === studentId.toString())
                .sort((a, b) => (a.score > b.score ? -1 : 1))[0]
                ? cv.freestyle.attempts
                    .filter(
                      (a) => a.studentId.toString() === studentId.toString()
                    )
                    .sort((a, b) => (a.score > b.score ? -1 : 1))[0].score
                : 0,
              myTryouts: cv.freestyle.attempts.filter(
                (a) => a.studentId.toString() === studentId.toString()
              ).length,
            },
            hasReward: studentData.rewards.filter(
              (r) => String(r.topicId) === String(cv._id)
            ).length
              ? true
              : false,
            // exams reduce
            exams: cv.exams.reduce((acc, cv) => {
              acc.push({
                ...cv,
                questions: cv.questions.length,
                isAvailable: studentData.exams.includes(cv._id),
                hasPerfectGrade: studentData.perfectGrades.includes(cv._id),
                attemptsCounter: studentData.attempts.filter(
                  (a) => a.exam.toString() === cv._id.toString()
                ).length,
                latestAttempt: studentData.attempts
                  .filter((a) => a.exam.toString() === cv._id.toString())
                  .sort((a, b) => (a.date > b.date ? -1 : 1))[0]
                  ? studentData.attempts
                      .filter((a) => a.exam.toString() === cv._id.toString())
                      .sort((a, b) => (a.date > b.date ? -1 : 1))[0].date
                  : null,
                highestGrade: studentData.attempts
                  .filter((a) => a.exam.toString() === cv._id.toString())
                  .sort((a, b) => (a.grade > b.grade ? -1 : 1))[0]
                  ? studentData.attempts
                      .filter((a) => a.exam.toString() === cv._id.toString())
                      .sort((a, b) => (a.grade > b.grade ? -1 : 1))[0].grade
                  : 0,
              });
              return acc;
            }, []),
          });
          return acc;
        }, []),
      };
    })
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error");
    });
});

// fetchTop10()
// matches with /api/course/top10/:courseId/:topicId
router.get("/top10/:courseId/:topicId", async (req, res) => {
  const { courseId, topicId } = req.params;

  try {
    const topics = await model.Course.findById(courseId)
      .select("topics")
      .then(({ topics }) => topics);

    const thisTopic = topics.filter((t) => String(t._id) == String(topicId))[0];

    const top10 = thisTopic.freestyle.attempts
      .sort((a, b) => (a.score > b.score ? -1 : 1))
      .slice(0, 10);

    res.json(top10);
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

module.exports = router;
