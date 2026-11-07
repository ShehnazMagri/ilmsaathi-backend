import { ModuleRecord } from '../models/ModuleRecord.js';

const formatLeave = record => ({ ...record.data, id: record._id.toString() });

export const getLeaves = async (req, res, next) => {
  try {
    const leaves = await ModuleRecord.find({ module: 'leaves', deleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves.map(formatLeave) });
  } catch (error) { next(error); }
};

export const applyLeave = async (req, res, next) => {
  try {
    const { applicantName, role, leaveType, startDate, endDate, days, reason } = req.body;
    const record = await ModuleRecord.create({ module: 'leaves', data: {
      applicantName: applicantName || req.user?.name || 'Applicant', role: role || req.user?.role || 'Student',
      leaveType: leaveType || 'Casual', startDate, endDate, days: Number(days) || 1, reason,
      status: 'Pending', appliedOn: new Date().toISOString().split('T')[0]
    }});
    res.status(201).json({ success: true, message: 'Leave application submitted successfully', data: formatLeave(record) });
  } catch (error) { next(error); }
};

export const updateLeaveStatus = async (req, res, next) => {
  try {
    const current = await ModuleRecord.findOne({ _id: req.params.id, module: 'leaves', deleted: false });
    if (!current) return res.status(404).json({ success: false, message: 'Leave application not found' });
    current.data = { ...current.data, status: req.body.status };
    await current.save();
    res.json({ success: true, message: `Leave status updated to ${req.body.status}`, data: formatLeave(current) });
  } catch (error) { next(error); }
};
