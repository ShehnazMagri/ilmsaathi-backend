import { Employee } from '../models/Employee.js';

// @desc    Get all active/non-deleted employees from MongoDB
// @route   GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ status: { $ne: 'Deleted' } }).sort({ createdAt: -1 });
    const formatted = employees.map(e => ({
      ...e.toObject(),
      id: e._id.toString()
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new employee record in MongoDB
// @route   POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const employeeId = req.body.employeeId || `EMP-S-${String(count + 1).padStart(3, '0')}`;

    const newEmployee = await Employee.create({
      ...req.body,
      employeeId,
      status: req.body.status || 'Active'
    });

    const formatted = { ...newEmployee.toObject(), id: newEmployee._id.toString() };
    res.status(201).json({ success: true, data: formatted });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update employee in MongoDB
// @route   PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Employee record not found' });
    }
    const formatted = { ...updated.toObject(), id: updated._id.toString() };
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Soft Delete employee (Update status to Deleted)
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: 'Deleted' },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee record not found' });
    }
    res.json({ success: true, message: 'Employee status updated to Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
