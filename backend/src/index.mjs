import express from "express";
import cors from "cors";
import {
  query,
  body,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { LecturesValidationSchemas } from "./utils/ValidationSchemas.mjs";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

const lectures = [
  {
    id: 1,
    name: "Enterprise Resource Planning(ERP)",
    lecturer: "Madam Veronica",
    day: "Monday",
  },
  {
    id: 2,
    name: "Information system auditing",
    lecturer: "Richard Mathenge",
    day: "Tuesday",
  },
];

//Registering middleware
const resolvelectureById = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findLectureIndex = lectures.findIndex(
    (lecture) => lecture.id === parsedId
  );
  if (findLectureIndex === -1) return res.sendStatus(404);
  req.findLectureIndex = findLectureIndex;
  next();
};

app.get("/", (req, res) => {
  res.status(201).send("Backend is running");
});

//Query parameters
app.get(
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

//Route parameters - pass dynamic value in a route
app.get("/api/lectures/:id", resolvelectureById, (req, res) => {
  const { findLectureIndex } = req;
  const findLecture = lectures[findLectureIndex];
  if (!findLecture) return res.sendStatus(404);
  return res.send(findLecture);
});

//creating resources using POST API
app.post(
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

//PUT API
app.put("/api/lectures/:id", resolvelectureById, (req, res) => {
  const { body, findLectureIndex } = req;
  lectures[findLectureIndex] = { id: lectures[findLectureIndex].id, ...body };
  res.sendStatus(200);
});

//PATCH API
app.patch("/api/lectures/:id", resolvelectureById, (req, res) => {
  const { body, findLectureIndex } = req;
  lectures[findLectureIndex] = { ...lectures[findLectureIndex], ...body };
  res.sendStatus(200);
});

//DELETE
app.delete("/api/lectures/:id", resolvelectureById, (req, res) => {
  const { findLectureIndex } = req;
  lectures.splice(findLectureIndex, 1);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
