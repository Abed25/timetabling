//Registering middleware

import { lectures } from "./constants.mjs";

export const resolvelectureById = (req, res, next) => {
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
