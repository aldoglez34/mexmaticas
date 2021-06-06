const router = require("express").Router();
const model = require("../../models");
const moment = require("moment");

// t_fetchInstitutions()
// matches with /teacherAPI/institutions/all
router.get("/all", (req, res) => {
  model.Institution.find({})
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// t_newInstitution()
// matches with /teacherAPI/institutions/new
router.post("/new", async (req, res) => {
  const { description, name } = req.body;

  try {
    // check if the classroom exists for this school
    const institutionsWithSameName = await model.Institution.find({
      name: name.trim(),
    })
      .select("name")
      .then((res) => res);

    if (institutionsWithSameName.length)
      return res.status(422).send("Ya existe una escuela con este nombre.");

    await model.Institution.create({
      description: (description || "").trim(),
      name: name.trim(),
    });

    res.status(200).send("La escuela ha sido agregada con éxito.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

module.exports = router;
