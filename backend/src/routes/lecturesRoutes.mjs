import { Router } from "express";
import { lectures } from "../utils/constants.mjs";
import {
  validationResult,
  query,
  checkSchema,
  matchedData,
} from "express-validator";
import { LecturesValidationSchemas } from "../utils/ValidationSchemas.mjs";
import { resolvelectureById } from "../utils/lectureId.mjs";

const router = Router();

//Query parameters
router.get(
  "/api/lectures",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Cannot be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Only characters between 3 - 10"),
  (req, res) => {
    console.log(req["express-validator#contexts"]);
    const { filter, value } = req.query;
    const results = validationResult(req);
    console.log(results);
    //if filter and value are not defined reveal all
    if (filter && value) {
      return res.send(
        lectures.filter(
          (lecture) =>
            lecture[filter] &&
            lecture[filter]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
        )
      );
    }

    res.send(lectures);
  }
);

//creating resources using POST API
router.post(
  "/api/lectures",
  checkSchema(LecturesValidationSchemas),
  (req, res) => {
    const results = validationResult(req);
    console.log(results);
    if (!results.isEmpty())
      return res.status(400).send({ error: results.array() });
    //console.log(req.body);
    //Clean and verified data
    const data = matchedData(req);
    console.log(data);
    const newLecture = { id: lectures[lectures.length - 1].id + 1, ...data };
    lectures.push(newLecture);
    return res.status(201).send(newLecture);
  }
);

//Route parameters - pass dynamic value in a route
router.get("/api/lectures/:id", resolvelectureById, (req, res) => {
  const { findLectureIndex } = req;
  const findLecture = lectures[findLectureIndex];
  if (!findLecture) return res.sendStatus(404);
  return res.send(findLecture);
});

//PUT API
router.put("/api/lectures/:id", resolvelectureById, (req, res) => {
  const { body, findLectureIndex } = req;
  lectures[findLectureIndex] = { id: lectures[findLectureIndex].id, ...body };
  res.sendStatus(200);
});

//PATCH API
router.patch("/api/lectures/:id", resolvelectureById, (req, res) => {
  const { body, findLectureIndex } = req;
  lectures[findLectureIndex] = { ...lectures[findLectureIndex], ...body };
  res.sendStatus(200);
});

//DELETE
router.delete("/api/lectures/:id", resolvelectureById, (req, res) => {
  const { findLectureIndex } = req;
  lectures.splice(findLectureIndex, 1);
  return res.sendStatus(200);
});

export default router;
