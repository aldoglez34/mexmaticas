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
  pushClassroomIntoStudents: (studentIds, classroomId) => {
    return new Promise((resolve, reject) => {
      studentIds.forEach((studentId, index, array) => {
        Student.findOneAndUpdate(
          { _id: studentId },
          {
            $addToSet: {
              classrooms: classroomId,
            },
          }
        ).then(() => {
          if (index === array.length - 1) resolve();
        });
      });
    });
  },
  removeClassroomsFromStudents: (studentsIds, classroomId) => {
    return new Promise((resolve, reject) => {
      studentsIds.forEach((studentId, index, array) => {
        Student.findOneAndUpdate(
          { _id: studentId },
          {
            $pull: {
              classrooms: classroomId,
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
  sortCoursesByLevel: (courses) => {
    const sortedCourses = (courses || [])
      .reduce((acc, cv) => {
        let orderNumber;
        switch (cv.school) {
          case "Primaria":
            orderNumber = 1;
            break;
          case "Secundaria":
            orderNumber = 2;
            break;
          case "Preparatoria":
            orderNumber = 3;
            break;
          case "Universidad":
            orderNumber = 4;
            break;
          default:
            break;
        }
        acc.push({
          isActive: cv.isActive,
          _id: cv._id,
          name: cv.name,
          school: cv.school,
          orderNumber,
        });
        return acc;
      }, [])
      .sort((a, b) => a.orderNumber - b.orderNumber);
    return sortedCourses;
  },
  isIdIncluded: (arr, id) => {
    let response = false;
    for (let item of arr) {
      if (String(item) === String(id)) response = true;
      break;
    }
    return response;
  },
  getFullName: (name, firstSurname, secondSurname) =>
    `${name ?? ""} ${firstSurname ?? ""} ${secondSurname ?? ""}`.trim(),
};

module.exports = utils;
