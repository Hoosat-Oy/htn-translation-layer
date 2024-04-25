import mongoose, { Schema, model, Document } from "mongoose";

export interface AnalyticsDTO {
  key?: string;
  element?: string;
  event?: string;
  method?: string;
  type?: string;
  url: string;
  refererr: string;
  userAgent: string;
  width: number;
  height: number;
  ip: string;
  createdAt?: Date;
}

interface AnalytiscDBO extends AnalyticsDTO, Document {
  _id: mongoose.Types.ObjectId;
}

const analyticsSchema: Schema<AnalytiscDBO> = new Schema({
  key: {
    type: String
  },
  element: {
    type: String,
  },
  event: {
    type: String,
  },
  method: {
    type: String,
  },
  type: {
    type: String,
  },
  url: {
    type: String,
  },
  refererr: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  ip: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model<AnalytiscDBO>("Analytics", analyticsSchema);