import mongoose, { Schema, Document } from "mongoose";

export interface IClassroom extends Document {
  name: string;
  roomNumber: string;
  building?: string;
  floor?: string;
  capacity: number;
  type: "classroom" | "lab" | "auditorium" | "sports" | "other";
  facilities: string[]; // e.g., ["Projector", "Smart Board", "Computers"]
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const classroomSchema = new Schema(
  {
    name: { type: String, required: true },
    roomNumber: { type: String, required: true, unique: true },
    building: { type: String },
    floor: { type: String },
    capacity: { type: Number, required: true },
    type: {
      type: String,
      enum: ["classroom", "lab", "auditorium", "sports", "other"],
      default: "classroom",
    },
    facilities: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

classroomSchema.index({ roomNumber: 1 });
classroomSchema.index({ type: 1 });
classroomSchema.index({ isActive: 1 });

export default mongoose.model<IClassroom>("Classroom", classroomSchema);
