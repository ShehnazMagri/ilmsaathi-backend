let MOCK_LEAVES = [
  { id: 'lv-1', applicantName: 'Liam O\'Connor', role: 'Student', leaveType: 'Sick', startDate: '2026-08-06', endDate: '2026-08-07', days: 2, reason: 'High fever and doctor recommendation rest', status: 'Approved', appliedOn: '2026-08-05' },
  { id: 'lv-2', applicantName: 'Elena Rostova', role: 'Teacher', leaveType: 'Casual', startDate: '2026-08-12', endDate: '2026-08-13', days: 2, reason: 'Attending educational symposium in NYC', status: 'Pending', appliedOn: '2026-08-06' }
];

export const getLeaves = async (req, res) => {
  res.json({ success: true, count: MOCK_LEAVES.length, data: MOCK_LEAVES });
};

export const applyLeave = async (req, res) => {
  const { applicantName, role, leaveType, startDate, endDate, days, reason } = req.body;
  const newLeave = {
    id: `lv-${Date.now()}`,
    applicantName: applicantName || req.user?.name || 'Applicant',
    role: role || req.user?.role || 'Student',
    leaveType: leaveType || 'Casual',
    startDate,
    endDate,
    days: Number(days) || 1,
    reason,
    status: 'Pending',
    appliedOn: new Date().toISOString().split('T')[0]
  };
  MOCK_LEAVES.unshift(newLeave);
  res.status(201).json({ success: true, message: 'Leave application submitted successfully', data: newLeave });
};

export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = MOCK_LEAVES.findIndex(l => l.id === id);
  if (index !== -1) {
    MOCK_LEAVES[index].status = status;
    return res.json({ success: true, message: `Leave status updated to ${status}`, data: MOCK_LEAVES[index] });
  }
  res.status(404).json({ success: false, message: 'Leave application not found' });
};
