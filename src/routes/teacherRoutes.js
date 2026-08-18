import express from 'express';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../controllers/teacherController.js';
import { protect, authorize } from '../middleware/auth.js';

export const teacherRouter = express.Router();

/**
 * @openapi
 * /teachers:
 *   get:
 *     summary: Retrieve list of faculty & teaching staff
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Add new faculty member (Admin/HR)
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 */
teacherRouter.get('/', protect, getTeachers);
teacherRouter.post('/', protect, authorize('super_admin', 'admin', 'principal', 'hr'), createTeacher);

/**
 * @openapi
 * /teachers/{id}:
 *   put:
 *     summary: Update faculty details
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Remove faculty record
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 */
teacherRouter.put('/:id', protect, authorize('super_admin', 'admin', 'principal', 'hr'), updateTeacher);
teacherRouter.delete('/:id', protect, authorize('super_admin', 'admin'), deleteTeacher);
