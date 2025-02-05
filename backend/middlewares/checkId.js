import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  console.log("Received ID:", req.params.id);

  if (!isValidObjectId(req.params.id)) {
    res.status(400); // Use 400 (Bad Request) instead of 404
    throw new Error(`Invalid ObjectId: ${req.params.id}`);
  }

  next();
}
export default checkId;

