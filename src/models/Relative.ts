import mongoose from "mongoose";

const RelativeSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"] },
  birthDate: { type: Date },
  
  fatherId: { type: mongoose.Schema.Types.ObjectId, ref: "Relative", default: null },
  motherId: { type: mongoose.Schema.Types.ObjectId, ref: "Relative", default: null },
  spouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Relative", default: null },
  
  positionX: { type: Number, default: 0 },
  positionY: { type: Number, default: 0 },
});

export default mongoose.models.Relative || mongoose.model("Relative", RelativeSchema);