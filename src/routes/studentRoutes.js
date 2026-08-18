import express from 'express';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

export const studentRouter = express.Router();

/**
 * @openapi
 * /students:
 *   get:
 *     summary: Retrieve list of all enrolled students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *   post:
 *     summary: Enroll new student (Admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 */
studentRouter.get('/', protect, getStudents);
studentRouter.post('/', protect, authorize('super_admin', 'admin', 'principal'), createStudent);

/**
 * @openapi
 * /students/{id}:
 *   put:
 *     summary: Update student record
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete student record
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 */
studentRouter.put('/:id', protect, authorize('super_admin', 'admin', 'principal'), updateStudent);
studentRouter.delete('/:id', protect, authorize('super_admin', 'admin'), deleteStudent);
