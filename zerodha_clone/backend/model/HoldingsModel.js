import { model } from "mongoose";
import { HoldingsSchema } from '../schemas/HoldingsSchemas.js';

const HoldingsModel = new model("holding", HoldingsSchema);

export { HoldingsModel };

