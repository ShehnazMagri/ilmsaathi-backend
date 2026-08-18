import express from 'express';

export const router = express.Router();

// Real-time memory stores initialized empty (NO static seed data)
let CLASSES = [];
let SUBJECTS = [];
let ATTENDANCE = [];
let HOMEWORK = [];
let EXAMS = [];
let RESULTS = [];
let FEES = [];
let PAYROLL = [];
let BOOKS = [];
let HOSTELS = [];
let TRANSPORT = [];
let INVENTORY = [];
let NOTICES = [];
let EVENTS = [];

// Helper to create GET, POST, PUT, DELETE routes for secondary modules
const createCrudRoutes = (path, store) => {
  router.get(path, (req, res) => {
    const activeItems = store.filter(item => item.status !== 'Deleted');
    res.json({ success: true, count: activeItems.length, data: activeItems });
  });

  router.post(path, (req, res) => {
    const newItem = { id: `item-${Date.now()}`, status: 'Active', ...req.body, createdAt: new Date().toISOString() };
    store.unshift(newItem);
    res.status(201).json({ success: true, data: newItem });
  });

  router.put(`${path}/:id`, (req, res) => {
    const index = store.findIndex(item => item.id === req.params.id);
    if (index !== -1) {
      store[index] = { ...store[index], ...req.body, updatedAt: new Date().toISOString() };
      return res.json({ success: true, data: store[index] });
    }
    res.status(404).json({ success: false, message: 'Record not found' });
  });

  router.delete(`${path}/:id`, (req, res) => {
    const item = store.find(item => item.id === req.params.id);
    if (item) {
      item.status = 'Deleted';
      return res.json({ success: true, message: 'Record status updated to Deleted successfully' });
    }
    res.status(404).json({ success: false, message: 'Record not found' });
  });
};

// Register secondary module endpoints
createCrudRoutes('/classes', CLASSES);
createCrudRoutes('/subjects', SUBJECTS);
createCrudRoutes('/attendance', ATTENDANCE);
createCrudRoutes('/homework', HOMEWORK);
createCrudRoutes('/exams', EXAMS);
createCrudRoutes('/results', RESULTS);
createCrudRoutes('/fees', FEES);
createCrudRoutes('/payroll', PAYROLL);
createCrudRoutes('/library', BOOKS);
createCrudRoutes('/hostel', HOSTELS);
createCrudRoutes('/transport', TRANSPORT);
createCrudRoutes('/inventory', INVENTORY);
createCrudRoutes('/notices', NOTICES);
createCrudRoutes('/events', EVENTS);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', system: 'Enterprise School Management System Backend', time: new Date().toISOString() });
});
