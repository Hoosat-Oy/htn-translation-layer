import mongoose, { Schema, model, Document } from "mongoose";

export interface IdentifiersDTO {
  _id: mongoose.Types.ObjectId;
  account: mongoose.Types.ObjectId;
  identifier: string;
}

interface IdentifiersDBO extends IdentifiersDTO, Document {
  _id: mongoose.Types.ObjectId;
}

const identifiersSchema: Schema<IdentifiersDBO> = new Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accounts",
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
});

export default model<IdentifiersDBO>("Identifiers", identifiersSchema);
