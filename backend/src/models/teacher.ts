import mongoose, { Document, Schema } from "mongoose";

export interface ITeacher extends Document {
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  bloodGroup?: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  qualifications: {
    degree: string;
    institution: string;
    year: number;
    specialization?: string;
    certificateUrl?: string;
  }[];
  employmentInfo: {
    joiningDate: Date;
    employmentType: "permanent" | "contract" | "probation";
    department?: string;
    designation: string;
    salary: number;
    bankDetails: {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      branch: string;
    };
    previousExperience?: {
      institution: string;
      position: string;
      years: number;
    }[];
  };
  assignedSubjects: {
    subjectId: mongoose.Types.ObjectId;
    subjectName: string;
    classes: {
      classId: mongoose.Types.ObjectId;
      className: string;
      section: string;
    }[];
  }[];
  assignedClasses: {
    classId: mongoose.Types.ObjectId;
    className: string;
    section: string;
    role: "class_teacher" | "subject_teacher";
  }[];
  attendance: {
    month: string;
    year: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    leaveDays: number;
  }[];
  leaveRequests: {
    type: "sick" | "casual" | "earned" | "maternity" | "paternity";
    fromDate: Date;
    toDate: Date;
    reason: string;
    status: "pending" | "approved" | "rejected";
    approvedBy?: mongoose.Types.ObjectId;
    approvedAt?: Date;
    rejectionReason?: string;
    appliedAt: Date;
  }[];
  performanceNotes: {
    academicYear: string;
    rating: number;
    feedback: string;
    addedBy: mongoose.Types.ObjectId;
    addedAt: Date;
  }[];
  documents: {
    photo?: string;
    resume?: string;
    degreeCertificates?: string[];
    experienceCertificates?: string[];
    idProof?: string;
    otherDocuments?: {
      name: string;
      url: string;
    }[];
  };
  status: "active" | "inactive" | "on_leave" | "terminated";
  notes: {
    content: string;
    addedBy: mongoose.Types.ObjectId;
    addedAt: Date;
  }[];
}

const teacherSchema: Schema<ITeacher> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    bloodGroup: { type: String },
    nationality: { type: String, required: true, default: "Indian" },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    phone: { type: String, required: true },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
    },
    qualifications: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: Number, required: true },
        specialization: { type: String },
        certificateUrl: { type: String },
      },
    ],
    employmentInfo: {
      joiningDate: { type: Date, required: true },
      employmentType: {
        type: String,
        enum: ["permanent", "contract", "probation"],
        required: true,
      },
      department: { type: String },
      designation: { type: String, required: true },
      salary: { type: Number, required: true },
      bankDetails: {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true },
        branch: { type: String, required: true },
      },
      previousExperience: [
        {
          institution: { type: String, required: true },
          position: { type: String, required: true },
          years: { type: Number, required: true },
        },
      ],
    },
    assignedSubjects: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectName: { type: String, required: true },
        classes: [
          {
            classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
            className: { type: String, required: true },
            section: { type: String, required: true },
          },
        ],
      },
    ],
    assignedClasses: [
      {
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
        className: { type: String, required: true },
        section: { type: String, required: true },
        role: {
          type: String,
          enum: ["class_teacher", "subject_teacher"],
          required: true,
        },
      },
    ],
    attendance: [
      {
        month: { type: String, required: true },
        year: { type: Number, required: true },
        presentDays: { type: Number, required: true },
        absentDays: { type: Number, required: true },
        lateDays: { type: Number, required: true },
        leaveDays: { type: Number, required: true },
      },
    ],
    leaveRequests: [
      {
        type: {
          type: String,
          enum: ["sick", "casual", "earned", "maternity", "paternity"],
          required: true,
        },
        fromDate: { type: Date, required: true },
        toDate: { type: Date, required: true },
        reason: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        approvedAt: { type: Date },
        rejectionReason: { type: String },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    performanceNotes: [
      {
        academicYear: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        feedback: { type: String, required: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    documents: {
      photo: { type: String },
      resume: { type: String },
      degreeCertificates: [{ type: String }],
      experienceCertificates: [{ type: String }],
      idProof: { type: String },
      otherDocuments: [
        {
          name: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on_leave", "terminated"],
      default: "active",
    },
    notes: [
      {
        content: { type: String, required: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ userId: 1 });
teacherSchema.index({ status: 1 });

const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
export default Teacher;
