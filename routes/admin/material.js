const router = require("express").Router();
const model = require("../../models");
const mongoose = require("mongoose");

// addMaterial()
// matches with /adminapi/material/add
router.put("/add", function (req, res) {
  const { courseId, name, topicId, type } = req.body;

  let link;

  if (type === "video") link = req.body.link;
  if (type === "pdf") link = `${courseId}/${topicId}/material/${name}`;

  model.Course.findById(courseId)
    .select("topics")
    .then(({ topics }) => {
      const topic = topics.filter((t) => String(t._id) === String(topicId))[0];

      const latestMaterial = topic.material.sort(
        (a, b) => b.materialOrderNumber - a.materialOrderNumber
      )[0];

      const highestMaterialOrderNumber = latestMaterial
        ? latestMaterial.materialOrderNumber
        : 0;

      model.Course.update(
        {
          _id: courseId,
          "topics._id": topicId,
        },
        {
          $push: {
            "topics.$.material": {
              materialOrderNumber: highestMaterialOrderNumber + 1,
              link,
              name,
              type,
            },
          },
        }
      )
        .then(() => res.send("El elemento fue agregado con éxito."))
        .catch((err) => {
          console.log("@error", err);
          res.status(422).send("Ocurrió un error.");
        });
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// deleteMaterial()
// matches with /adminapi/material/delete
router.put("/delete", function (req, res) {
  const { courseId, materialId, topicId } = req.body;

  model.Course.updateOne(
    {
      _id: mongoose.Types.ObjectId(courseId),
      "topics._id": topicId,
    },
    {
      $pull: {
        "topics.$.material": {
          _id: materialId,
        },
      },
    }
  )
    .then(() => res.json("El elemento fue eliminado con éxito."))
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
    });
});

// updateMaterialOrder()
// matches with /adminapi/material/update/order
router.put("/update/order", function (req, res) {
  const { courseId, newList, topicId } = req.body;

  model.Course.findById(courseId)
    .select("topics")
    .then(({ topics }) => {
      const thisTopicMaterial = topics.filter(
        ({ _id }) => String(_id) === String(topicId)
      )[0].material;

      const newMaterial = thisTopicMaterial.reduce((acc, cv) => {
        let materialOrderNumber;
        const _id = cv._id;
        const link = cv.link;
        const name = cv.name;
        const type = cv.type;

        const materialInNewList = newList.filter(
          (m) => String(m._id) === String(_id)
        )[0];

        if (materialInNewList) {
          materialOrderNumber = materialInNewList.newOrderNumber;
        } else {
          materialOrderNumber = cv.materialOrderNumber;
        }

        acc.push({ materialOrderNumber, _id, link, name, type });

        return acc;
      }, []);

      model.Course.update(
        {
          _id: courseId,
          "topics._id": topicId,
        },
        { "topics.$.material": newMaterial }
      )
        .then((data) => res.json(data))
        .catch((err) => {
          console.log("@error", err);
          res.status(422).send("Ocurrió un error.");
        });
    })
    .catch((err) => {
      console.log("@error", err);
      res.status(422).send("Ocurrió un error.");
      reject();
    });
});

module.exports = router;
