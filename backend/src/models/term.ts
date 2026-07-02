import mongoose, { Schema, Document } from "mongoose";

export interface ITerm extends Document {
  name: string; // "Term 1", "Semester 1"
  academicYear: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const termSchema = new Schema(
  {
    name: { type: String, required: true },
    academicYear: { type: Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

termSchema.index({ academicYear: 1 });
termSchema.index({ isActive: 1 });
termSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model<ITerm>("Term", termSchema);
