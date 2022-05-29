const { Course, Student } = require("../../models");

const utils = {
  getNextDifficulty: (diff) => {
    switch (diff) {
      case "Basic":
        return "Basic-Intermediate";
      case "Basic-Intermediate":
        return "Intermediate";
      case "Intermediate":
        return "Intermediate-Advanced";
      case "Intermediate-Advanced":
        return "Advanced";
    }
  },
  generateDefaultExams: (topicName) => {
    const examDifficulties = [
      "Basic",
      "Basic-Intermediate",
      "Intermediate",
      "Intermediate-Advanced",
      "Advanced",
    ];
    const defaultExams = [];
    for (let i = 0; i < examDifficulties.length; i++) {
      const exam = {
        difficulty: examDifficulties[i],
        examOrderNumber: i + 1,
        name: `${topicName} ${i + 1}`,
        description: "Descripción del examen.",
        duration: 10,
        qCounter: 10,
      };
      defaultExams.push(exam);
    }
    return defaultExams;
  },
  getNextTopicOrderNumber: (topics) => {
    const latestTopic = topics.sort(
      (a, b) => b.topicOrderNumber - a.topicOrderNumber
    )[0];

    return latestTopic ? latestTopic.topicOrderNumber + 1 : 0;
  },
  getBasicExamsOfAnArrayOfCourses: async (courses) => {
    const onlyBasicExamsIds = await Course.find({ _id: { $in: courses } })
      .select("topics.exams")
      .lean()
      .populate("topics.exams", "difficulty")
      .then((courses) => {
        const topics = courses.reduce((acc, cv) => {
          acc.push(...cv.topics);
          return acc;
        }, []);

        const exams = topics.reduce((acc, cv) => {
          acc.push(...cv.exams);
          return acc;
        }, []);

        const onlyBasics = exams.filter(
          ({ difficulty }) => difficulty === "Basic"
        );

        return onlyBasics.map((e) => e._id);
      });

    return onlyBasicExamsIds;
  },
  pushExamsIntoStudentsAccountsIfTheyDontExist: (
    studentsIds,
    coursesIds,
    examsIds
  ) => {
    return new Promise((resolve, reject) => {
      studentsIds.forEach((studentId, index, array) => {
        Student.findOneAndUpdate(
          { _id: studentId },
          {
            $addToSet: {
              courses: coursesIds,
              exams: examsIds,
            },
          }
        ).then(() => {
          if (index === array.length - 1) resolve();
        });
      });
    });
  },
  removeInstitutionFromClassrooms: (institutionId, classrooms) => {
    const classroomsArr = Array.isArray(classrooms) ? classrooms : [classrooms];
    return new Promise((resolve, reject) => {
      classroomsArr.forEach((classroomId, index, array) => {
        Student.findOneAndUpdate(
          { _id: institutionId },
          { institution: null }
        ).then(() => {
          if (index === array.length - 1) resolve();
        });
      });
    });
  },
};

module.exports = utils;
