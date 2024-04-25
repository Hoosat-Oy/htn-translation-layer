import mongoose, { Document, model, Schema } from 'mongoose';

export interface FilesDTO {
  _id?: mongoose.Types.ObjectId;
  group?: mongoose.Types.ObjectId;
  author?: mongoose.Types.ObjectId;
  filepath?: string | null;
  originalFilename?: string | null;
  newFilename?: string | null;
  domain?: string;
  uploadedAt?: Date;
}

interface FilesDBO extends FilesDTO, Document {
  _id: mongoose.Types.ObjectId;
}

const filesSchema : Schema<FilesDBO> = new Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
  originalFilename: {
    type: String,
    required: true,
  },
  newFilename: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

export default model<FilesDBO>("Files", filesSchema);