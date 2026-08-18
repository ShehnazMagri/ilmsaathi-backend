import { Teacher } from '../models/Teacher.js';

// @desc    Get all active/non-deleted teachers from MongoDB
// @route   GET /api/teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ status: { $ne: 'Deleted' } }).sort({ createdAt: -1 });
    const formatted = teachers.map(t => ({
      ...t.toObject(),
      id: t._id.toString()
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new teacher record in MongoDB
// @route   POST /api/teachers
export const createTeacher = async (req, res) => {
  try {
    const count = await Teacher.countDocuments();
    const employeeId = req.body.employeeId || `EMP-T-${String(count + 1).padStart(3, '0')}`;

    const newTeacher = await Teacher.create({
      ...req.body,
      employeeId,
      status: req.body.status || 'Active'
    });

    const formatted = { ...newTeacher.toObject(), id: newTeacher._id.toString() };
    res.status(201).json({ success: true, data: formatted });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update teacher in MongoDB
// @route   PUT /api/teachers/:id
export const updateTeacher = async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Teacher record not found' });
    }
    const formatted = { ...updated.toObject(), id: updated._id.toString() };
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Soft Delete teacher (Update status to Deleted)
// @route   DELETE /api/teachers/:id
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { status: 'Deleted' },
      { new: true }
    );
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher record not found' });
    }
    res.json({ success: true, message: 'Teacher status updated to Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
