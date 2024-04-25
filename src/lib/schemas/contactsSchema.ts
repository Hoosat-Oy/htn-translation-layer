import mongoose, { Schema, model, Document } from "mongoose";

export interface ContactsDTO {
  name: string;
  ycode: string;
  type: string;
  registered: string;
  phone: string;
  email: string;
  web: string;
  street: string;
  post: string;
  city: string;
  bcodes: string[];
}

interface ContactsDBO extends ContactsDTO, Document {
  _id: mongoose.Types.ObjectId;
}

const contactsSchema: Schema<ContactsDBO> = new Schema({
  name: { 
    type: String, 
    required: true
  },
  ycode: { 
    type: String, 
    required: true, 
    unique: true 
  },
  type: {
    type: String,
  },
  registered: {
    type: String,
  },
  phone: { 
    type: String, 
  },
  email: {
    type: String
  },
  web: { 
    type: String
  },
  street: {
    type: String,
  },
  post: {
    type: String,
  },
  city: { 
    type: String
  },
  bcodes: {
    type: [String]
  }
});

export default model<ContactsDBO>("Contacts", contactsSchema);

