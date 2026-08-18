import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    admissionNo: { type: String, required: true, unique: true },
    rollNo: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    dob: { type: String },
    bloodGroup: { type: String },
    className: { type: String, required: true },
    section: { type: String, required: true },
    parentName: { type: String, required: true },
    parentContact: { type: String, required: true },
    address: { type: String },
    status: { type: String, enum: ['Active', 'Inactive', 'Graduated', 'Deleted'], default: 'Active' },
    feesPaid: { type: Number, default: 0 },
    totalFees: { type: Number, default: 5000 },
    attendanceRate: { type: Number, default: 95 }
  },
  { timestamps: true }
);

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
