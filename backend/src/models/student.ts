import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  admissionNumber: string;
  rollNumber: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  bloodGroup?: string;
  religion?: string;
  caste?: string;
  nationality: string;
  motherTongue?: string;
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
    address?: string;
  };
  medicalInfo: {
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
    bloodType?: string;
    disabilities?: string[];
    doctorName?: string;
    doctorPhone?: string;
  };
  parentGuardian: {
    fatherName: string;
    fatherPhone: string;
    fatherOccupation?: string;
    fatherEmail?: string;
    motherName: string;
    motherPhone: string;
    motherOccupation?: string;
    motherEmail?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianRelationship?: string;
  };
  academicInfo: {
    admissionDate: Date;
    classId: mongoose.Types.ObjectId;
    section: string;
    previousSchool?: string;
    previousClass?: string;
    transferCertificate?: string;
    promotionHistory: {
      academicYear: string;
      fromClass: string;
      toClass: string;
      date: Date;
      promotedBy: mongoose.Types.ObjectId;
    }[];
  };
  documents: {
    photo?: string;
    birthCertificate?: string;
    aadharCard?: string;
    transferCertificate?: string;
    marksheet?: string;
    otherDocuments?: {
      name: string;
      url: string;
    }[];
  };
  status: "active" | "transferred" | "graduated" | "suspended" | "inactive";
  notes: {
    content: string;
    addedBy: mongoose.Types.ObjectId;
    addedAt: Date;
  }[];
  feeHistory: {
    academicYear: string;
    totalFees: number;
    paidFees: number;
    pendingFees: number;
    paymentHistory: {
      amount: number;
      date: Date;
      mode: "cash" | "card" | "bank_transfer" | "online";
      receiptNumber: string;
    }[];
  }[];
  attendance: {
    academicYear: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
  }[];
  examResults: {
    examName: string;
    academicYear: string;
    subjects: {
      subjectId: mongoose.Types.ObjectId;
      subjectName: string;
      marksObtained: number;
      totalMarks: number;
      grade: string;
      percentage: number;
    }[];
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    grade: string;
    rank?: number;
    date: Date;
  }[];
  activities: {
    activity: string;
    date: Date;
    type: "academic" | "extracurricular" | "disciplinary" | "achievement";
    description?: string;
    addedBy: mongoose.Types.ObjectId;
  }[];
}

const studentSchema: Schema<IStudent> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admissionNumber: { type: String, required: true, unique: true },
    rollNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    bloodGroup: { type: String },
    religion: { type: String },
    caste: { type: String },
    nationality: { type: String, required: true, default: "Indian" },
    motherTongue: { type: String },
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
      address: { type: String },
    },
    medicalInfo: {
      allergies: [{ type: String }],
      chronicConditions: [{ type: String }],
      medications: [{ type: String }],
      bloodType: { type: String },
      disabilities: [{ type: String }],
      doctorName: { type: String },
      doctorPhone: { type: String },
    },
    parentGuardian: {
      fatherName: { type: String, required: true },
      fatherPhone: { type: String, required: true },
      fatherOccupation: { type: String },
      fatherEmail: { type: String },
      motherName: { type: String, required: true },
      motherPhone: { type: String, required: true },
      motherOccupation: { type: String },
      motherEmail: { type: String },
      guardianName: { type: String },
      guardianPhone: { type: String },
      guardianRelationship: { type: String },
    },
    academicInfo: {
      admissionDate: { type: Date, required: true },
      classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
      section: { type: String, required: true },
      previousSchool: { type: String },
      previousClass: { type: String },
      transferCertificate: { type: String },
      promotionHistory: [
        {
          academicYear: { type: String, required: true },
          fromClass: { type: String, required: true },
          toClass: { type: String, required: true },
          date: { type: Date, required: true },
          promotedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        },
      ],
    },
    documents: {
      photo: { type: String },
      birthCertificate: { type: String },
      aadharCard: { type: String },
      transferCertificate: { type: String },
      marksheet: { type: String },
      otherDocuments: [
        {
          name: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
    },
    status: {
      type: String,
      enum: ["active", "transferred", "graduated", "suspended", "inactive"],
      default: "active",
    },
    notes: [
      {
        content: { type: String, required: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    feeHistory: [
      {
        academicYear: { type: String, required: true },
        totalFees: { type: Number, required: true },
        paidFees: { type: Number, required: true },
        pendingFees: { type: Number, required: true },
        paymentHistory: [
          {
            amount: { type: Number, required: true },
            date: { type: Date, required: true },
            mode: {
              type: String,
              enum: ["cash", "card", "bank_transfer", "online"],
              required: true,
            },
            receiptNumber: { type: String, required: true },
          },
        ],
      },
    ],
    attendance: [
      {
        academicYear: { type: String, required: true },
        totalDays: { type: Number, required: true },
        presentDays: { type: Number, required: true },
        absentDays: { type: Number, required: true },
        lateDays: { type: Number, required: true },
        excusedDays: { type: Number, required: true },
      },
    ],
    examResults: [
      {
        examName: { type: String, required: true },
        academicYear: { type: String, required: true },
        subjects: [
          {
            subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
            subjectName: { type: String, required: true },
            marksObtained: { type: Number, required: true },
            totalMarks: { type: Number, required: true },
            grade: { type: String, required: true },
            percentage: { type: Number, required: true },
          },
        ],
        totalMarks: { type: Number, required: true },
        obtainedMarks: { type: Number, required: true },
        percentage: { type: Number, required: true },
        grade: { type: String, required: true },
        rank: { type: Number },
        date: { type: Date, required: true },
      },
    ],
    activities: [
      {
        activity: { type: String, required: true },
        date: { type: Date, required: true },
        type: {
          type: String,
          enum: ["academic", "extracurricular", "disciplinary", "achievement"],
          required: true,
        },
        description: { type: String },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ userId: 1 });
studentSchema.index({ "academicInfo.classId": 1 });
studentSchema.index({ status: 1 });

const Student = mongoose.model<IStudent>("Student", studentSchema);
export default Student;
