const router = require("express").Router();
const model = require("../../models");
const errorLogger = require("../utils/errors");

// fetchTeacherClassrooms()
// matches with /teacherapi/classrooms/all/:teacherId
router.get("/all/:teacherId", (req, res) => {
  model.Teacher.findOne({ _id: req.params.teacherId })
    .populate({
      path: "classrooms",
      select: "_id members name description institution school createdAt",
      populate: {
        path: "institution",
        select: "name",
      },
    })
    .then((data) => {
      const classrooms = (data.classrooms || [])
        .map((cl) => ({
          _id: cl._id,
          description: cl.description,
          institution: cl.institution.name,
          memberCount: (cl.members || []).length,
          name: cl.name,
          school: cl.school,
          createdAt: cl.createdAt,
        }))
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
      res.json(classrooms);
    })
    .catch((err) => errorLogger(err, res, 422));
});

// fetchOneClassroom()
// matches with /teacherapi/classrooms/:classroomId
router.get("/:classroomId", (req, res) => {
  model.Classroom.findById(req.params.classroomId)
    .populate("institution", "name")
    .populate("members", "name email firstSurname secondSurname")
    .populate("courses", "name school")
    .populate("teacher", "name firstSurname secondSurname _id")
    .then((data) => res.json(data))
    .catch((err) => errorLogger(err, res, 422));
});

module.exports = router;
