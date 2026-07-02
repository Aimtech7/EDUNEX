import mongoose, { Schema, Document } from "mongoose";

// Period configuration for the timetable
export interface IPeriodConfig {
  periodNumber: number;
  startTime: string; // e.g., "08:00"
  endTime: string; // e.g., "08:45"
  type: "regular" | "break" | "lunch";
  label?: string; // e.g., "Break", "Lunch"
}

// Break/Lunch configuration
export interface IBreakConfig {
  type: "break" | "lunch";
  startTime: string;
  endTime: string;
  label: string;
}

// Timetable configuration
export interface ITimetableConfig {
  academicYear: mongoose.Types.ObjectId;
  term: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  section: string;
  daysOfWeek: string[]; // ["Monday", "Tuesday", ...]
  schoolStartTime: string;
  schoolEndTime: string;
  periodDuration: number; // in minutes
  numberOfPeriods: number;
  periods: IPeriodConfig[];
  breaks: IBreakConfig[];
}

// Individual timetable entry
export interface ITimetableEntry {
  day: string; // "Monday", "Tuesday", etc.
  periodNumber: number;
  subject: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  classroom: mongoose.Types.ObjectId;
  startTime: string;
  endTime: string;
  notes?: string;
}

// Main Timetable document
export interface ITimetable extends Document {
  config: ITimetableConfig;
  entries: ITimetableEntry[];
  status: "draft" | "published" | "locked";
  publishedAt?: Date;
  lockedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Period Config Schema
const periodConfigSchema = new Schema({
  periodNumber: { type: Number, required: true },
  startTime: { type: String, required: true }, // "HH:mm" format
  endTime: { type: String, required: true }, // "HH:mm" format
  type: { type: String, enum: ["regular", "break", "lunch"], default: "regular" },
  label: { type: String },
});

// Break Config Schema
const breakConfigSchema = new Schema({
  type: { type: String, enum: ["break", "lunch"], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  label: { type: String, required: true },
});

// Timetable Config Schema
const timetableConfigSchema = new Schema({
  academicYear: { type: Schema.Types.ObjectId, ref: "AcademicYear", required: true },
  term: { type: Schema.Types.ObjectId, ref: "Term", required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  section: { type: String, required: true },
  daysOfWeek: {
    type: [String],
    default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  schoolStartTime: { type: String, required: true }, // "08:00"
  schoolEndTime: { type: String, required: true }, // "15:00"
  periodDuration: { type: Number, required: true }, // in minutes
  numberOfPeriods: { type: Number, required: true },
  periods: [periodConfigSchema],
  breaks: [breakConfigSchema],
});

// Timetable Entry Schema
const timetableEntrySchema = new Schema({
  day: { type: String, required: true },
  periodNumber: { type: Number, required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
  classroom: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  notes: { type: String },
});

// Main Timetable Schema
const timetableSchema = new Schema(
  {
    config: { type: timetableConfigSchema, required: true },
    entries: [timetableEntrySchema],
    status: {
      type: String,
      enum: ["draft", "published", "locked"],
      default: "draft",
    },
    publishedAt: { type: Date },
    lockedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes for efficient queries
timetableSchema.index({ "config.class": 1, "config.academicYear": 1, "config.term": 1 });
timetableSchema.index({ "config.section": 1 });
timetableSchema.index({ status: 1 });
timetableSchema.index({ "entries.teacher": 1 });
timetableSchema.index({ "entries.classroom": 1 });

// Compound index for conflict detection
timetableSchema.index({ "entries.day": 1, "entries.periodNumber": 1, "entries.teacher": 1 });
timetableSchema.index({ "entries.day": 1, "entries.periodNumber": 1, "entries.classroom": 1 });

export default mongoose.model<ITimetable>("Timetable", timetableSchema);
