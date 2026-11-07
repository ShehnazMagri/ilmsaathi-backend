import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Student } from './models/Student.js';
import { Teacher } from './models/Teacher.js';
import { Employee } from './models/Employee.js';
import { ModuleRecord } from './models/ModuleRecord.js';

dotenv.config();

const students = [
  ['ADM-2026-001', '101', 'Aarav', 'Sharma', 'aarav.sharma@example.com', 'Male', 'Class 10', 'A', 'Rajesh Sharma'],
  ['ADM-2026-002', '102', 'Ananya', 'Verma', 'ananya.verma@example.com', 'Female', 'Class 10', 'A', 'Priya Verma'],
  ['ADM-2026-003', '103', 'Kabir', 'Khan', 'kabir.khan@example.com', 'Male', 'Class 10', 'B', 'Imran Khan'],
  ['ADM-2026-004', '104', 'Meera', 'Iyer', 'meera.iyer@example.com', 'Female', 'Class 9', 'A', 'Lakshmi Iyer'],
  ['ADM-2026-005', '105', 'Vihaan', 'Patel', 'vihaan.patel@example.com', 'Male', 'Class 9', 'B', 'Nitin Patel']
].map(([admissionNo, rollNo, firstName, lastName, email, gender, className, section, parentName], index) => ({
  admissionNo, rollNo, firstName, lastName, email, gender, className, section, parentName,
  phone: `+91 98765 43${210 + index}`, parentContact: `+91 98765 54${210 + index}`,
  dob: `201${index}-0${index + 2}-12`, bloodGroup: ['A+', 'O+', 'B+', 'AB+', 'O-'][index],
  address: `${12 + index}, Green Park, New Delhi`, feesPaid: [45000, 50000, 30000, 48000, 25000][index],
  totalFees: 50000, attendanceRate: [96, 98, 91, 95, 89][index], status: 'Active'
}));

const teachers = [
  ['EMP-T-001', 'Rohit', 'Mehta', 'rohit.mehta@example.com', 'Mathematics', 'M.Sc Mathematics', 'Algebra & Calculus'],
  ['EMP-T-002', 'Neha', 'Kapoor', 'neha.kapoor@example.com', 'Science', 'M.Sc Physics', 'Physics'],
  ['EMP-T-003', 'Sanjay', 'Rao', 'sanjay.rao@example.com', 'English', 'M.A English', 'English Literature'],
  ['EMP-T-004', 'Pooja', 'Nair', 'pooja.nair@example.com', 'Social Science', 'M.A History', 'History & Civics'],
  ['EMP-T-005', 'Arjun', 'Singh', 'arjun.singh@example.com', 'Computer Science', 'MCA', 'Computer Science']
].map(([employeeId, firstName, lastName, email, department, qualification, specialization], index) => ({
  employeeId, firstName, lastName, email, department, qualification, specialization,
  phone: `+91 98989 10${100 + index}`, gender: index === 1 || index === 3 ? 'Female' : 'Male',
  classesAssigned: [`Class ${10 - (index % 2)}`, 'Class 9'], joiningDate: `202${index}-06-01`,
  salary: 48000 + index * 3500, address: `${index + 1}, Teachers Colony, New Delhi`, status: 'Active'
}));

const employees = [
  ['EMP-S-001', 'Kavita', 'Joshi', 'kavita.joshi@example.com', 'HR', 'Human Resources'],
  ['EMP-S-002', 'Manish', 'Gupta', 'manish.gupta@example.com', 'Accountant', 'Finance'],
  ['EMP-S-003', 'Sonia', 'Das', 'sonia.das@example.com', 'Librarian', 'Library'],
  ['EMP-S-004', 'Deepak', 'Yadav', 'deepak.yadav@example.com', 'Receptionist', 'Administration'],
  ['EMP-S-005', 'Ramesh', 'Kumar', 'ramesh.kumar@example.com', 'Driver', 'Transport']
].map(([employeeId, firstName, lastName, email, role, department], index) => ({
  employeeId, firstName, lastName, email, role, department, designation: role,
  phone: `+91 98111 22${100 + index}`, joiningDate: `202${index}-07-15`, salary: 30000 + index * 2500,
  status: 'Active'
}));

const makeRecords = () => {
  const names = ['Aarav Sharma', 'Ananya Verma', 'Kabir Khan', 'Meera Iyer', 'Vihaan Patel'];
  return {
    classes: ['A', 'B', 'A', 'B', 'A'].map((section, i) => ({ name: `Class ${10 - (i % 2)}`, section, roomNumber: `R-${101 + i}`, capacity: 40, enrolledStudents: 28 + i, classTeacher: ['Rohit Mehta', 'Neha Kapoor', 'Sanjay Rao', 'Pooja Nair', 'Arjun Singh'][i], subjectsCount: 7 })),
    subjects: [['MAT-101', 'Mathematics', 'Mathematics', 'Rohit Mehta'], ['SCI-101', 'Physics', 'Science', 'Neha Kapoor'], ['ENG-101', 'English', 'English', 'Sanjay Rao'], ['SST-101', 'History', 'Social Science', 'Pooja Nair'], ['CSC-101', 'Computer Science', 'Computer Science', 'Arjun Singh']].map(([code, name, department, teacherName]) => ({ code, name, department, teacherName, credits: 4, totalHours: 120 })),
    attendance: names.map((studentName, i) => ({ studentId: `ADM-2026-00${i + 1}`, studentName, className: i < 3 ? 'Class 10' : 'Class 9', section: i % 2 ? 'A' : 'B', date: '2026-11-07', status: i === 2 ? 'Late' : 'Present', remarks: i === 2 ? 'Arrived after assembly' : '' })),
    homework: ['Mathematics Worksheet', 'Physics Lab Report', 'English Essay', 'History Timeline', 'Python Fundamentals'].map((title, i) => ({ title, subject: ['Mathematics', 'Physics', 'English', 'History', 'Computer Science'][i], className: i < 3 ? 'Class 10' : 'Class 9', section: i % 2 ? 'B' : 'A', assignedBy: ['Rohit Mehta', 'Neha Kapoor', 'Sanjay Rao', 'Pooja Nair', 'Arjun Singh'][i], assignedDate: '2026-11-05', dueDate: '2026-11-14', description: `Complete the ${title.toLowerCase()} and submit it online.`, submissionsCount: 18 + i, totalStudents: 32 })),
    exams: ['Mathematics Unit Test', 'Physics Quiz', 'English Mid-Term', 'History Unit Test', 'Computer Science Quiz'].map((title, i) => ({ title, examType: i === 2 ? 'Mid-Term' : i % 2 ? 'Quiz' : 'Unit Test', className: i < 3 ? 'Class 10' : 'Class 9', subject: ['Mathematics', 'Physics', 'English', 'History', 'Computer Science'][i], date: `2026-11-${15 + i}`, startTime: '09:00', endTime: '10:30', maxMarks: 50, passingMarks: 20, roomNo: `R-${101 + i}` })),
    results: names.map((studentName, i) => ({ studentId: `ADM-2026-00${i + 1}`, studentName, rollNo: `${101 + i}`, className: i < 3 ? 'Class 10' : 'Class 9', section: i % 2 ? 'A' : 'B', examTitle: 'Mathematics Unit Test', subjectMarks: [{ subject: 'Mathematics', marksObtained: 42 - i * 2, maxMarks: 50, grade: i < 3 ? 'A' : 'B+' }], totalMarks: 42 - i * 2, maxTotalMarks: 50, percentage: 84 - i * 4, gpa: 9 - i * 0.3, rank: i + 1, status: 'Pass' })),
    fees: names.map((studentName, i) => { const totalAmount = 50000; const paidAmount = [50000, 50000, 30000, 48000, 25000][i]; return ({ studentId: `ADM-2026-00${i + 1}`, studentName, className: i < 3 ? 'Class 10' : 'Class 9', invoiceNo: `INV-2026-${String(i + 1).padStart(3, '0')}`, tuitionFee: 42000, transportFee: 5000, libraryFee: 1000, hostelFee: 2000, totalAmount, paidAmount, dueDate: '2026-11-30', status: paidAmount === totalAmount ? 'Paid' : 'Partial' }); }),
    payroll: employees.map((employee, i) => { const basicSalary = 30000 + i * 2500; return ({ employeeId: employee.employeeId, employeeName: `${employee.firstName} ${employee.lastName}`, role: employee.role, monthYear: 'November 2026', basicSalary, hra: 5000, allowances: 2000, pfDeduction: 1800, taxDeduction: 500, netSalary: basicSalary + 4700, paymentDate: '2026-11-01', status: 'Paid' }); }),
    library: [['978-1-01', 'The Alchemist', 'Paulo Coelho', 'Fiction'], ['978-1-02', 'A Brief History of Time', 'Stephen Hawking', 'Science'], ['978-1-03', 'Wings of Fire', 'A.P.J. Abdul Kalam', 'Biography'], ['978-1-04', 'Introduction to Algorithms', 'Cormen', 'Technology'], ['978-1-05', 'The Discovery of India', 'Jawaharlal Nehru', 'History']].map(([isbn, title, author, category], i) => ({ isbn, title, author, category, copies: 8 + i, availableCopies: 3 + i, rackLocation: `Rack ${String.fromCharCode(65 + i)}-${10 + i}`, status: i === 0 ? 'Low Stock' : 'Available' })),
    hostel: ['101', '102', '103', '201', '202'].map((roomNo, i) => ({ hostelName: i < 3 ? 'Tagore House' : 'Kalam House', roomNo, capacity: i === 2 ? 4 : 2, occupied: i === 1 ? 1 : 2, type: i === 2 ? 'Dormitory' : 'Double', monthlyFee: i === 2 ? 6000 : 8500 })),
    transport: ['North City Route', 'East City Route', 'South City Route', 'West City Route', 'Central City Route'].map((routeName, i) => ({ routeName, vehicleNo: `DL 01 AB ${1200 + i}`, driverName: ['Ramesh Kumar', 'Suresh Singh', 'Amit Sharma', 'Vijay Yadav', 'Mohan Lal'][i], driverPhone: `+91 98000 11${200 + i}`, stopsCount: 8 + i, studentsCount: 25 + i, capacity: 40 })),
    inventory: [['Student Desk', 'Furniture', 120, 3500, 'Good', 'Block A'], ['Desktop Computer', 'Computers', 30, 42000, 'Good', 'Computer Lab'], ['Football', 'Sports', 18, 1200, 'New', 'Sports Room'], ['Microscope', 'Lab Equipment', 12, 18000, 'Good', 'Science Lab'], ['A4 Paper Ream', 'Stationery', 80, 320, 'New', 'Store Room']].map(([itemName, category, quantity, unitPrice, condition, location]) => ({ itemName, category, quantity, unitPrice, totalValue: quantity * unitPrice, condition, location })),
    notices: ['Annual Day Rehearsal', 'Mid-Term Examination Schedule', 'Parent-Teacher Meeting', 'Science Fair Registration', 'Winter Break Notice'].map((title, i) => ({ title, category: i === 1 ? 'Exam' : i === 3 ? 'Academic' : 'General', targetAudience: i === 2 ? 'Parents' : 'All', date: `2026-11-0${i + 3}`, postedBy: 'School Administration', content: `${title} information is now available. Please review the complete announcement.`, pinned: i < 2 })),
    events: ['Annual Day Celebration', 'Inter-House Football', 'Science Exhibition', 'Teachers Workshop', 'Winter Vacation'].map((title, i) => ({ title, date: `2026-12-${String(5 + i * 3).padStart(2, '0')}`, time: i === 4 ? 'All Day' : '10:00 AM', venue: ['School Auditorium', 'Main Ground', 'Science Block', 'Conference Hall', 'School Campus'][i], category: ['Cultural', 'Sports', 'Academic', 'Workshop', 'Holiday'][i], description: `Join us for the upcoming ${title.toLowerCase()}.` })),
    leaves: names.map((applicantName, i) => ({ applicantName, role: i < 3 ? 'Student' : i === 3 ? 'Teacher' : 'Employee', leaveType: ['Sick', 'Casual', 'Emergency', 'Casual', 'Sick'][i], startDate: `2026-11-${10 + i}`, endDate: `2026-11-${10 + i}`, days: 1, reason: ['Medical appointment', 'Family commitment', 'Personal emergency', 'Professional development', 'Health recovery'][i], status: ['Approved', 'Pending', 'Rejected', 'Approved', 'Pending'][i], appliedOn: '2026-11-07' }))
  };
};

async function seedCollection(Model, records, uniqueField) {
  for (const record of records) {
    await Model.updateOne({ [uniqueField]: record[uniqueField] }, { $setOnInsert: record }, { upsert: true });
  }
}

async function run() {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB is unavailable. Start MongoDB, then run npm run seed again.');

  await seedCollection(User, [{ name: 'IlmSaathi Admin', email: 'admin@ilmsaathi.edu', password: 'Demo@12345', role: 'admin', phone: '+91 90000 00001' }], 'email');
  await seedCollection(Student, students, 'admissionNo');
  await seedCollection(Teacher, teachers, 'employeeId');
  await seedCollection(Employee, employees, 'employeeId');

  const modules = makeRecords();
  for (const [module, records] of Object.entries(modules)) {
    const existing = await ModuleRecord.countDocuments({ module, deleted: false });
    if (existing < 5) {
      await ModuleRecord.deleteMany({ module });
      await ModuleRecord.insertMany(records.map(data => ({ module, data })));
    }
  }

  console.log('Demo data seeded: 5 records per primary and ERP module table.');
}

run()
  .catch(error => { console.error('[Seed Error]', error.message); process.exitCode = 1; })
  .finally(async () => mongoose.disconnect());
