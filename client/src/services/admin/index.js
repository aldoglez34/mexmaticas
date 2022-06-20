import {
  deleteClassroom,
  fetchClassroomHistory,
  fetchClassrooms,
  fetchOneClassroom,
  newClassroom,
  updateClassroomCourses,
  updateClassroomDescription,
  updateClassroomInstitution,
  updateClassroomMembers,
  updateClassroomName,
  updateClassroomSchool,
} from "./classrooms";

import {
  fetchCourses,
  fetchOneCourse,
  newCourse,
  updateCourseDescription,
  updateCourseName,
  updateCoursePrice,
  updateCourseSchool,
  updateCourseStatus,
  updateCourseSummary,
} from "./courses";

import {
  fetchExam,
  updateExamDescription,
  updateExamDuration,
  updateExamName,
  updateExamQCounter,
} from "./exam";

import {
  deleteInstitution,
  fetchInstitutions,
  fetchOneInstitution,
  newInstitution,
  updateInstitutionDescription,
  updateInstitutionName,
} from "./institutions";

import { addMaterial, deleteMaterial, updateMaterialOrder } from "./material";

import { deleteMessage, fetchMessages, markSeen, respondMsg } from "./messages";

import {
  deleteQuestion,
  newDichotomousQuestion,
  newDichotomousQuestionWithImage,
  newImageWithTwoAnswersQuestion,
  newMultipleOptionQuestion,
  newMultipleOptionWithImage,
  newSimpleQuestion,
  newSimpleWithImageQuestion,
  newSimpleWithTwoAnswersQuestion,
} from "./questions";

import {
  assignCourse,
  fetchOneStudent,
  fetchStudentHistory,
  fetchStudents,
  fetchStudentUnpurchased,
} from "./students";

import {
  assignTeacher,
  fetchOneTeacher,
  fetchTeachers,
  registerNewTeacher,
} from "./teachers";

import {
  deleteTopic,
  fetchAvailableDifficulties,
  fetchTopic,
  newTopic,
  updateTopicDescription,
  updateTopicFreestyleTimer,
  updateTopicName,
  updateTopicOrder,
  updateTopicSubject,
} from "./topics";

export {
  addMaterial,
  assignCourse,
  assignTeacher,
  deleteClassroom,
  deleteInstitution,
  deleteMaterial,
  deleteMessage,
  deleteQuestion,
  deleteTopic,
  fetchAvailableDifficulties,
  fetchClassroomHistory,
  fetchClassrooms,
  fetchCourses,
  fetchExam,
  fetchInstitutions,
  fetchMessages,
  fetchOneClassroom,
  fetchOneCourse,
  fetchOneInstitution,
  fetchOneStudent,
  fetchOneTeacher,
  fetchStudentHistory,
  fetchStudents,
  fetchStudentUnpurchased,
  fetchTeachers,
  fetchTopic,
  markSeen,
  newClassroom,
  newCourse,
  newDichotomousQuestion,
  newDichotomousQuestionWithImage,
  newImageWithTwoAnswersQuestion,
  newInstitution,
  newMultipleOptionQuestion,
  newMultipleOptionWithImage,
  newSimpleQuestion,
  newSimpleWithImageQuestion,
  newSimpleWithTwoAnswersQuestion,
  newTopic,
  registerNewTeacher,
  respondMsg,
  updateClassroomCourses,
  updateClassroomDescription,
  updateClassroomInstitution,
  updateClassroomMembers,
  updateClassroomName,
  updateClassroomSchool,
  updateCourseDescription,
  updateCourseName,
  updateCoursePrice,
  updateCourseSchool,
  updateCourseStatus,
  updateCourseSummary,
  updateExamDescription,
  updateExamDuration,
  updateExamName,
  updateExamQCounter,
  updateInstitutionDescription,
  updateInstitutionName,
  updateMaterialOrder,
  updateTopicDescription,
  updateTopicFreestyleTimer,
  updateTopicName,
  updateTopicOrder,
  updateTopicSubject,
};
