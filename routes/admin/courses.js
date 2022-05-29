const router = require("express").Router();
const model = require("../../models");

// fetchCourses()
// matches with /adminapi/courses/all
router.get("/all", function (req, res) {
  model.Course.find({})
    .sort({ name: 1 })
    .select("name school isActive")
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// fetchOneCourse()
// matches with /adminapi/courses/:courseId
router.get("/:courseId", function (req, res) {
  const { courseId } = req.params;

  model.Course.findById(courseId)
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// newCourse()
// matches with /adminapi/courses/new
router.post("/new", function (req, res) {
  const { description, name, price, school, summary } = req.body;

  // find all courses from the same school first
  model.Course.find({
    school,
  })
    .sort("name")
    .select("name")
    .then((courses) => {
      const doesNewCourseExist = courses.some(
        (c) => String(c.name).trim() === String(name).trim()
      );

      if (doesNewCourseExist) {
        res
          .status(500)
          .send("Un curso con este nombre ya existe en este nivel educativo.");
      } else {
        model.Course.create({
          description: description,
          name: name,
          price: price,
          school: school,
          topicsSummary: summary.split(","),
        })
          .then((newCourse) => {
            res.json({ courseId: newCourse._id });
          })
          .catch((err) => {
            console.log("@error", err);
            res.status(422).send("Ocurrió un error.");
          });
      }
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// updateCourseName()
// matches with /adminapi/courses/update/name
router.put("/update/name", function (req, res) {
  const { courseId, newName, school } = req.body;

  // find all courses from the same school first
  model.Course.find({
    school,
  })
    .sort("name")
    .select("name")
    .then((courses) => {
      const doesNewCourseExist = courses.some(
        (c) => String(c.name).trim() === String(newName).trim()
      );

      if (doesNewCourseExist) {
        res
          .status(500)
          .send("Un curso con este nombre ya existe en este nivel educativo.");
      } else {
        model.Course.findByIdAndUpdate(courseId, { name: newName })
          .then(() => {
            res.json("Nombre del curso actualizado satisfactoriamente.");
          })
          .catch((err) => {
            console.log("@error", err);
            res.status(422).send("Ocurrió un error.");
          });
      }
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// updateCourseSchool()
// matches with /adminapi/courses/update/school
router.put("/update/school", function (req, res) {
  const { courseId, courseName, newSchool } = req.body;

  // find all courses from the new school first
  model.Course.find({
    school: newSchool,
  })
    .sort("name")
    .select("name")
    .then((courses) => {
      const doesCourseExistInNewSchool = courses.some(
        (c) => String(c.name).trim() === String(courseName).trim()
      );

      if (doesCourseExistInNewSchool) {
        res
          .status(500)
          .send("Un curso con este nombre ya existe en este nivel educativo.");
      } else {
        model.Course.findByIdAndUpdate(courseId, { school: newSchool })
          .then(() => {
            res.json("Nivel escolar del curso actualizado satisfactoriamente.");
          })
          .catch((err) => {
            console.log("@error", err);
            res.status(422).send("Ocurrió un error.");
          });
      }
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// updateCourseStatus()
// matches with /adminapi/courses/update/status
router.put("/update/status", function (req, res) {
  const newStatus = req.body.newStatus;
  const courseId = req.body.courseId;

  model.Course.findByIdAndUpdate(courseId, { isActive: newStatus })
    .then(() => {
      res.json("Estatus del curso actualizado satisfactoriamente.");
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// updateCoursePrice()
// matches with /adminapi/courses/update/price
router.put("/update/price", function (req, res) {
  const { newPrice, courseId } = req.body;

  model.Course.findByIdAndUpdate(courseId, { price: newPrice })
    .then(() => {
      res.json("Precio del curso actualizada satisfactoriamente.");
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// updateCourseDescription()
// matches with /adminapi/courses/update/description
router.put("/update/description", function (req, res) {
  const { newDescription, courseId } = req.body;

  model.Course.findByIdAndUpdate(courseId, { description: newDescription })
    .then(() => {
      res.json("Descripción del curso actualizada satisfactoriamente.");
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// updateCourseSummary()
// matches with /adminapi/courses/update/summary
router.put("/update/summary", function (req, res) {
  const { newSummary, courseId } = req.body;

  model.Course.findByIdAndUpdate(courseId, {
    topicsSummary: newSummary.split(","),
  })
    .then(() => {
      res.json("Descripción del curso actualizada satisfactoriamente.");
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

module.exports = router;
