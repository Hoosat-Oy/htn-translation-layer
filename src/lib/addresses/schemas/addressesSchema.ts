import mongoose, { Schema, model, Document } from "mongoose";

export interface AddressesDTO {
  _id: mongoose.Types.ObjectId;
  identifier: mongoose.Types.ObjectId;
  address: string;
  token: string;
}

interface AddressesDBO extends AddressesDTO, Document {
  _id: mongoose.Types.ObjectId;
}

const addressesSchema: Schema<AddressesDBO> = new Schema({
  identifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Identifiers",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

export default model<AddressesDBO>("Addresses", addressesSchema);
