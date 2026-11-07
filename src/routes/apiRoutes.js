import express from 'express';
import { ModuleRecord } from '../models/ModuleRecord.js';

export const router = express.Router();

const formatRecord = record => ({ ...record.data, id: record._id.toString() });

// Persistent MongoDB CRUD for the secondary ERP modules.
const createCrudRoutes = (path, module) => {
  router.get(path, async (req, res, next) => {
    try {
      const records = await ModuleRecord.find({ module, deleted: false }).sort({ createdAt: -1 });
      res.json({ success: true, count: records.length, data: records.map(formatRecord) });
    } catch (error) { next(error); }
  });

  router.post(path, async (req, res, next) => {
    try {
      const record = await ModuleRecord.create({ module, data: req.body });
      res.status(201).json({ success: true, data: formatRecord(record) });
    } catch (error) { next(error); }
  });

  router.put(`${path}/:id`, async (req, res, next) => {
    try {
      const record = await ModuleRecord.findOneAndUpdate(
        { _id: req.params.id, module, deleted: false },
        { $set: { data: req.body } },
        { new: true }
      );
      if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
      res.json({ success: true, data: formatRecord(record) });
    } catch (error) { next(error); }
  });

  router.delete(`${path}/:id`, async (req, res, next) => {
    try {
      const record = await ModuleRecord.findOneAndUpdate(
        { _id: req.params.id, module, deleted: false }, { deleted: true }, { new: true }
      );
      if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
      res.json({ success: true, message: 'Record deleted successfully' });
    } catch (error) { next(error); }
  });
};

// Register secondary module endpoints
createCrudRoutes('/classes', 'classes');
createCrudRoutes('/subjects', 'subjects');
createCrudRoutes('/attendance', 'attendance');
createCrudRoutes('/homework', 'homework');
createCrudRoutes('/exams', 'exams');
createCrudRoutes('/results', 'results');
createCrudRoutes('/fees', 'fees');
createCrudRoutes('/payroll', 'payroll');
createCrudRoutes('/library', 'library');
createCrudRoutes('/hostel', 'hostel');
createCrudRoutes('/transport', 'transport');
createCrudRoutes('/inventory', 'inventory');
createCrudRoutes('/notices', 'notices');
createCrudRoutes('/events', 'events');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', system: 'IlmSaathi School ERP Backend', time: new Date().toISOString() });
});
