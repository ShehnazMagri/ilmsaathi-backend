import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    dob: { type: String },
    qualification: { type: String, required: true },
    specialization: { type: String, required: true },
    department: { type: String, default: 'Academics' },
    classesAssigned: [{ type: String }],
    address: { type: String },
    joiningDate: { type: String },
    salary: { type: Number, default: 45000 },
    status: { type: String, enum: ['Active', 'Inactive', 'On Leave', 'Deleted'], default: 'Active' },
    avatar: { type: String }
  },
  { timestamps: true }
);

export const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
