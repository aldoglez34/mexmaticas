const router = require("express").Router();
const model = require("../../models");
const utils = require("../utils/utils");

// t_fetchTopic()
// matches with /teacherAPI/topics/:courseId/:topicId
router.get("/:courseId/:topicId", function (req, res) {
  const { courseId, topicId } = req.params;

  model.Course.findById(courseId)
    .select("topics")
    .lean()
    .populate("topics.exams", "name qCounter questions difficulty")
    .then(({ topics }) => {
      const thisTopic = topics.filter((t) => t._id.toString() === topicId)[0];

      const thisTopicExams = thisTopic.exams.reduce((acc, cv) => {
        acc.push({
          _id: cv._id,
          actualQCounter: cv.questions.length,
          difficulty: cv.difficulty,
          name: cv.name,
          qCounter: cv.qCounter,
        });
        return acc;
      }, []);

      res.json({ ...thisTopic, exams: thisTopicExams });
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_fetchAvailableDifficulties()
// matches with /teacherAPI/topics/difficulties/:courseId/:topicId
router.get("/difficulties/:courseId/:topicId", function (req, res) {
  const courseId = req.params.courseId;
  const topicId = req.params.topicId;

  model.Course.find({ _id: courseId, "topics._id": topicId })
    // .select("topics")
    .populate("topics.exams")
    .then((data) =>
      // res.json(data.topics.filter((t) => t._id.toString() === topicId)[0])
      res.send(data)
    )
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_updateTopicName
// matches with /teacherAPI/topics/update/name
router.put("/update/name", function (req, res) {
  const { newName, courseId, topicId } = req.body;

  model.Course.update(
    {
      _id: courseId,
      "topics._id": topicId,
    },
    { "topics.$.name": newName }
  )
    .then((data) => {
      res.json(data);
      // res.json("Nombre del curso actualizado satisfactoriamente.");
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_updateTopicSubject
// matches with /teacherAPI/topics/update/subject
router.put("/update/subject", function (req, res) {
  const { newSubject, courseId, topicId } = req.body;

  model.Course.update(
    {
      _id: courseId,
      "topics._id": topicId,
    },
    { "topics.$.subject": newSubject }
  )
    .then((data) => {
      res.json(data);
      // res.json("Nombre del curso actualizado satisfactoriamente.");
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_updateTopicDescription
// matches with /teacherAPI/topics/update/description
router.put("/update/description", function (req, res) {
  const { newDescription, courseId, topicId } = req.body;

  model.Course.update(
    {
      _id: courseId,
      "topics._id": topicId,
    },
    { "topics.$.description": newDescription }
  )
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_updateTopicFreestyleTimer
// matches with /teacherAPI/topics/update/timer
router.put("/update/timer", function (req, res) {
  const { newTimer, courseId, topicId } = req.body;

  model.Course.update(
    {
      _id: courseId,
      "topics._id": topicId,
    },
    { "topics.$.freestyle.timer": newTimer }
  )
    .then((data) => {
      res.json(data);
      // res.json("Nombre del curso actualizado satisfactoriamente.");
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_newTopic()
// matches with /teacherAPI/topics/new
router.put("/new", async (req, res) => {
  const {
    courseId,
    name: topicName,
    subject: topicSubject,
    description: topicDescription,
    freestyleTimer: topicFreestyleTimer,
  } = req.body;

  try {
    // get all the topics from that course
    const topics = await model.Course.findById(courseId)
      .select("topics")
      .then(({ topics }) => topics);

    // check if this topic name exists
    const doesNewTopicExist = topics.some(
      (t) => String(t.name).trim() === String(topicName).trim()
    );

    // if new topic exists, send response to the client and interupt the process
    // syntax has to have a "return" so that it doesn't continue with the next lines
    if (doesNewTopicExist) {
      return res
        .status(500)
        .send("Un tema con este nombre ya existe en este curso.");
    }

    // get the next topic order number
    const nextTopicOrderNumber = utils.getNextTopicOrderNumber(topics);

    // generate data for 5 exams, one for each difficulty for the new topic
    const defaultExams = utils.generateDefaultExams(topicName);

    // insert those 5 exams and get their ids
    // also get the id of the basic exam alone
    const { basicExamId, examIds } = await model.Exam.insertMany(defaultExams, {
      ordered: true,
    }).then((exams) => {
      const examIds = exams.map((e) => e._id);
      const basicExamId = exams.filter((e) => e.difficulty === "Basic")[0]._id;
      return { basicExamId, examIds };
    });

    // get an array of students that need the basic exam of the new topic
    // these would be students that have purchased the course but don't have the basic exam for this topic
    const idsOfStudentsThatNeedThisExam = await model.Student.find({})
      .select("courses exams")
      .then((allStudents) =>
        allStudents
          .filter(
            (s) =>
              s.courses.includes(String(courseId)) &&
              !s.exams.includes(String(basicExamId))
          )
          .map((s) => s._id)
      );

    // if theres a student that needs the basic exam of this new topic, push it to the student's exams
    if (idsOfStudentsThatNeedThisExam.length) {
      for (const id of idsOfStudentsThatNeedThisExam) {
        await model.Student.findOneAndUpdate(
          { _id: String(id) },
          { $push: { exams: basicExamId } }
        );
      }
    }

    // data for the new topic
    const newTopicData = {
      topicOrderNumber: nextTopicOrderNumber,
      name: topicName,
      subject: topicSubject,
      description: topicDescription,
      freestyle: {
        timer: topicFreestyleTimer,
      },
      exams: examIds,
    };

    // push the topic
    const insertNewTopic = await model.Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { topics: newTopicData } },
      { new: true }
    ).then(({ topics }) => topics);

    // get the newly created topic data
    const newlyCreatedTopic = insertNewTopic.filter(
      (t) => String(t.name).trim() === String(newTopicData.name).trim()
    )[0];

    // edit the topic to build the reward link
    // this needs to be done after the topic is created+
    // because it uses the _id of the newly created topic
    await model.Course.findOneAndUpdate(
      { _id: courseId, "topics._id": newlyCreatedTopic._id },
      {
        $set: {
          "topics.$.reward": {
            link: `${courseId}/${newlyCreatedTopic._id}/rewards/medal`,
          },
        },
      }
    );

    // send back to the client
    res.json({
      topicId: newlyCreatedTopic._id,
      topicName: newlyCreatedTopic.name,
    });
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

// t_updateTopicOrder()
// matches with /teacherAPI/topics/update/order
router.put("/update/order", function (req, res) {
  const { courseId, newList } = req.body;

  let updateAllTopics = new Promise((resolve, reject) => {
    newList.forEach((value, index, array) => {
      const { _id: topicId, newOrderNumber } = value;

      model.Course.update(
        {
          _id: courseId,
          "topics._id": topicId,
        },
        { "topics.$.topicOrderNumber": newOrderNumber }
      )
        .then(() => {
          if (index === array.length - 1) resolve();
        })
        .catch((err) => {
          console.log("@error", err);
          res.status(422).send("Ocurrió un error.");
          reject();
        });
    });
  });

  updateAllTopics
    .then(() => res.send("Los temas fueron actualizados con éxito."))
    .catch((err) => console.log(err));
});

// t_deleteTopic()
// matches with /teacherAPI/topics/delete
router.put("/delete", async (req, res) => {
  const { courseId, topicId } = req.body;

  try {
    // first get the ids of the exams that belong to this topic
    // also check if the topic that's being removed is the last one in this course
    const { examsIds, isLastTopic } = await model.Course.findById(courseId)
      .select("topics")
      .then(({ topics }) => ({
        examsIds: topics.filter((t) => String(t._id) === String(topicId))[0]
          .exams,
        isLastTopic: topics.length === 1,
      }));

    // then remove all the exams from the Exam model
    await model.Exam.deleteMany({ _id: examsIds });

    // delete the topic from the course collection
    await model.Course.findOneAndUpdate(
      { _id: courseId },
      { $pull: { topics: { _id: topicId } } }
    );

    // if this is the last topic on the course, set the course status to inactive
    if (isLastTopic) {
      await model.Course.findOneAndUpdate(
        { _id: courseId },
        { isActive: false }
      );
    }

    // to delete all the remaining keys in the Student collection
    // first get all the students ids that have purchased this course
    const idsOfStudentsThatPurchasedThisCourse = await model.Student.find({})
      .select("courses")
      .then((allStudents) =>
        allStudents
          .filter((s) => s.courses.includes(String(courseId)))
          .map((s) => s._id)
      );

    // if there are students that have this course
    if (idsOfStudentsThatPurchasedThisCourse.length) {
      for (const id of idsOfStudentsThatPurchasedThisCourse) {
        // delete rewards, exams, attempts and perfect grades
        await model.Student.findOneAndUpdate(
          { _id: String(id) },
          {
            $pull: {
              rewards: { topicId: topicId },
              exams: { $in: examsIds },
              attempts: { exam: { $in: examsIds } },
              perfectGrades: { $in: examsIds },
            },
          }
        );
      }
    }

    res.status(200).send("El tema fue borrado con éxito.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

module.exports = router;
