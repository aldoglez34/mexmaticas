import axios from "axios";

export default {
  // ==============================================
  // INSTITUTIONS
  // ==============================================

  t_fetchInstitutions: () => axios.get("/teacherAPI/institutions/all"),

  t_fetchOneInstitution: (institutionId) =>
    axios.get("/teacherAPI/institutions/" + institutionId),

  t_newInstitution: (data) => axios.post("/teacherAPI/institutions/new", data),

  t_updateInstitutionName: (data) =>
    axios.put("/teacherAPI/institutions/update/name", data),

  t_updateInstitutionDescription: (data) =>
    axios.put("/teacherAPI/institutions/update/description", data),

  // ==============================================
  // CLASSROOMS
  // ==============================================

  t_fetchClassrooms: () => axios.get("/teacherAPI/classrooms/all"),

  t_fetchOneClassroom: (classroomId) =>
    axios.get("/teacherAPI/classrooms/" + classroomId),

  t_newClassroom: (data) => axios.post("/teacherAPI/classrooms/new", data),

  t_updateClassroomName: (data) =>
    axios.put("/teacherAPI/classrooms/update/name", data),

  t_updateClassroomDescription: (data) =>
    axios.put("/teacherAPI/classrooms/update/description", data),

  t_updateClassroomSchool: (data) =>
    axios.put("/teacherAPI/classrooms/update/school", data),

  t_updateClassroomInstitution: (data) =>
    axios.put("/teacherAPI/classrooms/update/institution", data),

  // ==============================================
  // COURSES
  // ==============================================

  t_fetchCourses: () => axios.get("/teacherAPI/courses/all"),

  t_fetchOneCourse: (courseId) => axios.get("/teacherAPI/courses/" + courseId),

  t_newCourse: (data) => axios.post("/teacherAPI/courses/new", data),

  t_updateCoursePaypalId: (data) =>
    axios.put("/teacherAPI/courses/update/paypalId", data),

  t_updateCourseName: (data) =>
    axios.put("/teacherAPI/courses/update/name", data),

  t_updateCourseSchool: (data) =>
    axios.put("/teacherAPI/courses/update/school", data),

  t_updateCourseStatus: (data) =>
    axios.put("/teacherAPI/courses/update/status", data),

  t_updateCoursePrice: (data) =>
    axios.put("/teacherAPI/courses/update/price", data),

  t_updateCourseDescription: (data) =>
    axios.put("/teacherAPI/courses/update/description", data),

  t_updateCourseSummary: (data) =>
    axios.put("/teacherAPI/courses/update/summary", data),

  // ==============================================
  // TOPICS
  // ==============================================

  t_fetchTopic: (courseId, topicId) =>
    axios.get("/teacherAPI/topics/" + courseId + "/" + topicId),

  t_fetchAvailableDifficulties: (courseId, topicId) =>
    axios.get("/teacherAPI/topics/difficulties/" + courseId + "/" + topicId),

  t_updateTopicName: (data) =>
    axios.put("/teacherAPI/topics/update/name", data),

  t_updateTopicSubject: (data) =>
    axios.put("/teacherAPI/topics/update/subject", data),

  t_updateTopicDescription: (data) =>
    axios.put("/teacherAPI/topics/update/description", data),

  t_updateTopicFreestyleTimer: (data) =>
    axios.put("/teacherAPI/topics/update/timer", data),

  t_newTopic: (topicData) => axios.put("/teacherAPI/topics/new", topicData),

  t_updateTopicOrder: (data) =>
    axios.put("/teacherAPI/topics/update/order", data),

  t_deleteTopic: (data) => axios.put("/teacherAPI/topics/delete", data),

  // ==============================================
  // MATERIAL
  // ==============================================

  t_addMaterial: (data) => axios.put("/teacherAPI/material/add", data),

  t_deleteMaterial: (data) => axios.put("/teacherAPI/material/delete", data),

  t_updateMaterialOrder: (data) =>
    axios.put("/teacherAPI/material/update/order", data),

  // ==============================================
  // EXAM
  // ==============================================

  t_fetchExam: (examId) => axios.get("/teacherAPI/exam/fetch/" + examId),

  t_updateExamName: (data) => axios.put("/teacherAPI/exam/update/name", data),

  t_updateExamDuration: (data) =>
    axios.put("/teacherAPI/exam/update/duration", data),

  t_updateExamQCounter: (data) =>
    axios.put("/teacherAPI/exam/update/qCounter", data),

  t_updateExamDescription: (data) =>
    axios.put("/teacherAPI/exam/update/description", data),

  // ==============================================
  // STUDENTS
  // ==============================================

  t_fetchStudents: () => axios.get("/teacherAPI/students/all"),

  t_fetchStudentUnpurchased: (studentId) =>
    axios.get("/teacherAPI/students/unpurchased/" + studentId),

  t_fetchStudentHistory: (studentId) =>
    axios.get("/teacherAPI/students/history/" + studentId),

  t_assignCourse: (data) =>
    axios.put("/teacherAPI/students/assignCourse", data),

  t_fetchOneStudent: (studentId) =>
    axios.get("/teacherAPI/students/" + studentId),

  // ==============================================
  // MESSAGES
  // ==============================================

  t_fetchMessages: () => axios.get("/teacherAPI/messages/all"),

  t_markSeen: (msgId) => axios.put("/teacherAPI/messages/markSeen/" + msgId),

  t_respondMsg: (data) => axios.put("/teacherAPI/messages/respond", data),

  // ==============================================
  // QUESTIONS
  // ==============================================

  t_newSimpleQuestion: (data) =>
    axios.post("/teacherAPI/questions/simpleQuestion/new", data),

  t_newSimpleWithImageQuestion: (data) =>
    axios.post("/teacherAPI/questions/simpleWithImage/new", data),

  t_newImageWithTwoAnswersQuestion: (data) =>
    axios.post("/teacherAPI/questions/imageWithTwoAnswers/new", data),

  t_newSimpleWithTwoAnswersQuestion: (data) =>
    axios.post("/teacherAPI/questions/simpleWithTwoAnswers/new", data),

  t_newMultipleOptionQuestion: (data) =>
    axios.post("/teacherAPI/questions/multipleOption/new", data),

  t_newMultipleOptionWithImage: (data) =>
    axios.post("/teacherAPI/questions/multipleOptionWithImage/new", data),

  t_newDichotomousQuestion: (data) =>
    axios.post("/teacherAPI/questions/dichotomousQuestion/new", data),

  t_newDichotomousQuestionWithImage: (data) =>
    axios.post("/teacherAPI/questions/dichotomousQuestionWithImage/new", data),

  t_deleteQuestion: (data) => axios.put("/teacherAPI/questions/delete", data),
};
