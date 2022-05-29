const router = require("express").Router();
const model = require("../../models");
const { removeInstitutionFromClassrooms } = require("../utils/helpers");

// fetchInstitutions()
// matches with /adminapi/institutions/all
router.get("/all", (req, res) => {
  model.Institution.find({})
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// fetchOneInstitution()
// matches with /adminapi/institutions/:institutionId
router.get("/:institutionId", (req, res) => {
  const { institutionId } = req.params;

  model.Institution.findById(institutionId)
    .then((data) => res.json(data))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// newInstitution()
// matches with /adminapi/institutions/new
router.post("/new", async (req, res) => {
  const { description, name } = req.body;

  try {
    // check if the classroom exists for this school
    const allInstitutionsInCaps = await model.Institution.find()
      .select("name")
      .then((res) => res.map(({ name }) => String(name).toUpperCase().trim()));

    const doesInstitutionExist = allInstitutionsInCaps.some(
      (i) => i === String(name).toUpperCase().trim()
    );

    if (doesInstitutionExist)
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

// updateInstitutionName()
// matches with /adminapi/institutions/update/name
router.put("/update/name", async (req, res) => {
  const { institutionId, newName } = req.body;

  try {
    // check if the classroom exists for this school
    const allInstitutionsInCaps = await model.Institution.find()
      .select("name")
      .then((res) => res.map(({ name }) => String(name).toUpperCase().trim()));

    const doesInstitutionExist = allInstitutionsInCaps.some(
      (i) => i === String(newName).toUpperCase().trim()
    );

    if (doesInstitutionExist)
      return res.status(422).send("Ya existe una escuela con este nombre.");

    await model.Institution.findByIdAndUpdate(institutionId, {
      name: newName,
    });

    res
      .status(200)
      .send("Nombre de la escuela fue actualizado satisfactoriamente.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// updateInstitutionDescription()
// matches with /adminapi/institutions/update/description
router.put("/update/description", async (req, res) => {
  const { institutionId, newDescription } = req.body;

  try {
    await model.Institution.findByIdAndUpdate(institutionId, {
      description: newDescription,
    });

    res.status(200).send("La descripción fue actualizada satisfactoriamente.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error.");
  }
});

// deleteInstitution()
// matches with /adminapi/institutions/delete
router.put("/delete", async (req, res) => {
  const { institutionId } = req.body;

  try {
    // get the classrooomsIds that have this institution associated to them
    const classroomsIds = await model.Classroom.find({
      institution: institutionId,
    }).then((res) => res.map((c) => c._id));

    // remove this association from each classroom
    await removeInstitutionFromClassrooms(institutionId, classroomsIds);

    // delete the topic from the course collection
    await model.Institution.remove({ _id: institutionId });

    res.status(200).send("El salón fue borrado con éxito.");
  } catch (err) {
    console.log("@error", err);
    res.status(422).send("Ocurrió un error");
  }
});

module.exports = router;
