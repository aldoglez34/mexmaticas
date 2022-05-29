const router = require("express").Router();

// ==============================================
// GUEST
// ==============================================
const guest = require("./guest/guest");
router.use("/guestapi", guest);

// ==============================================
// STUDENT
// ==============================================
const student = require("./student/student");
router.use("/studentapi", student);

// ==============================================
// ADMIN
// ==============================================
const classroomRoutes = require("./admin/classroom");
router.use("/adminapi/classrooms", classroomRoutes);

const coursesRoutes = require("./admin/courses");
router.use("/adminapi/courses", coursesRoutes);

const examRoutes = require("./admin/exam");
router.use("/adminapi/exam", examRoutes);

const institutionsRoutes = require("./admin/institutions");
router.use("/adminapi/institutions", institutionsRoutes);

const materialRoutes = require("./admin/material");
router.use("/adminapi/material", materialRoutes);

const messagesRoutes = require("./admin/messages");
router.use("/adminapi/messages", messagesRoutes);

const questionsRoutes = require("./admin/questions");
router.use("/adminapi/questions", questionsRoutes);

const studentsRoutes = require("./admin/students");
router.use("/adminapi/students", studentsRoutes);

router.use("/adminapi/teachers", require("./admin/teachers"));

const topicsRoutes = require("./admin/topics");
router.use("/adminapi/topics", topicsRoutes);

module.exports = router;
