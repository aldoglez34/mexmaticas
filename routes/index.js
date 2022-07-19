const router = require("express").Router();

const BASE_URL = {
  ADMIN: "adminapi",
  CONVERSATION: "conversationapi",
  GUEST: "guestapi",
  STUDENT: "studentapi",
  TEACHER: "teacherapi",
};

// ==============================================
// GUEST
// ==============================================
router.use(`/${BASE_URL.GUEST}`, require("./guest/guest"));

// ==============================================
// STUDENT
// ==============================================
router.use(`/${BASE_URL.STUDENT}`, require("./student/student"));

// ==============================================
// ADMIN
// ==============================================
router.use(`/${BASE_URL.ADMIN}/classrooms`, require("./admin/classroom"));
router.use(`/${BASE_URL.ADMIN}/courses`, require("./admin/courses"));
router.use(`/${BASE_URL.ADMIN}/exam`, require("./admin/exam"));
router.use(`/${BASE_URL.ADMIN}/institutions`, require("./admin/institutions"));
router.use(`/${BASE_URL.ADMIN}/material`, require("./admin/material"));
router.use(`/${BASE_URL.ADMIN}/questions`, require("./admin/questions"));
router.use(`/${BASE_URL.ADMIN}/students`, require("./admin/students"));
router.use(`/${BASE_URL.ADMIN}/teachers`, require("./admin/teachers"));
router.use(`/${BASE_URL.ADMIN}/topics`, require("./admin/topics"));

// ==============================================
// TEACHER
// ==============================================
router.use(`/${BASE_URL.TEACHER}/classrooms`, require("./teacher/classroom"));
router.use(`/${BASE_URL.TEACHER}/teacher`, require("./teacher/teacher"));

// ==============================================
// CONVERSATION
// ==============================================
router.use(
  `/${BASE_URL.CONVERSATION}/conversations`,
  require("./conversation/conversation")
);

module.exports = router;
