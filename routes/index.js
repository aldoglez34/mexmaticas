const router = require("express").Router();

// ==============================================
// STUDENT API
// ==============================================
const guestRoutes = require("./api/guestRoutes");
router.use("/api/guest", guestRoutes);

const studentRoutes = require("./api/studentRoutes");
router.use("/api/student", studentRoutes);

const courseRoutes = require("./api/courseRoutes");
router.use("/api/course", courseRoutes);

const examRoutes = require("./api/examRoutes");
router.use("/api/exam", examRoutes);

const freestyleRoutes = require("./api/freestyleRoutes");
router.use("/api/freestyle", freestyleRoutes);

// ==============================================
// TEACHER API
// ==============================================
const tCoursesRoutes = require("./teacherAPI/tCoursesRoutes");
router.use("/teacherAPI/courses", tCoursesRoutes);

const tMessagesRoutes = require("./teacherAPI/tMessagesRoutes");
router.use("/teacherAPI/messages", tMessagesRoutes);

const tTopicsRoutes = require("./teacherAPI/tTopicsRoutes");
router.use("/teacherAPI/topics", tTopicsRoutes);

const tMaterialRoutes = require("./teacherAPI/tMaterialRoutes");
router.use("/teacherAPI/material", tMaterialRoutes);

const tStudentRoutes = require("./teacherAPI/tStudentRoutes");
router.use("/teacherAPI/students", tStudentRoutes);

const tExamRoutes = require("./teacherAPI/tExamRoutes");
router.use("/teacherAPI/exam", tExamRoutes);

const tQuestionsRoutes = require("./teacherAPI/tQuestionsRoutes");
router.use("/teacherAPI/questions", tQuestionsRoutes);

module.exports = router;
