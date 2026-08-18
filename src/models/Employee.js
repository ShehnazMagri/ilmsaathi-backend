import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    joiningDate: { type: String },
    salary: { type: Number, default: 35000 },
    status: { type: String, enum: ['Active', 'Inactive', 'On Leave', 'Deleted'], default: 'Active' },
    avatar: { type: String }
  },
  { timestamps: true }
);

export const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
