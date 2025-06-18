import { model } from "mongoose";
import { PositionsSchema } from '../schemas/PositionsSchema.js';

const PositionsModel = new model("position", PositionsSchema);

export { PositionsModel };

