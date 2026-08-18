import { Student } from '../models/Student.js';

// @desc    Get all active/non-deleted students from MongoDB
// @route   GET /api/students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ status: { $ne: 'Deleted' } }).sort({ createdAt: -1 });
    // Transform _id to id for client convenience
    const formatted = students.map(s => ({
      ...s.toObject(),
      id: s._id.toString()
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new student record in MongoDB
// @route   POST /api/students
export const createStudent = async (req, res) => {
  try {
    const {
      admissionNo,
      rollNo,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      bloodGroup,
      className,
      section,
      parentName,
      parentContact,
      address,
      status
    } = req.body;

    // Generate admissionNo if omitted
    const count = await Student.countDocuments();
    const generatedAdmNo = admissionNo || `ADM-2025-${String(count + 1).padStart(3, '0')}`;
    const generatedRollNo = rollNo || String(100 + count + 1);

    const newStudent = await Student.create({
      admissionNo: generatedAdmNo,
      rollNo: generatedRollNo,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      bloodGroup,
      className: className || 'Class 10',
      section: section || 'A',
      parentName,
      parentContact,
      address,
      status: status || 'Active'
    });

    const formatted = { ...newStudent.toObject(), id: newStudent._id.toString() };
    res.status(201).json({ success: true, data: formatted });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update student in MongoDB
// @route   PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }
    const formatted = { ...updated.toObject(), id: updated._id.toString() };
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Soft Delete student (Update status to Deleted)
// @route   DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: 'Deleted' },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }
    res.json({ success: true, message: 'Student status updated to Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
