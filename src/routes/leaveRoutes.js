import express from 'express';
import { getLeaves, applyLeave, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/auth.js';

export const leaveRouter = express.Router();

/**
 * @openapi
 * /leaves:
 *   get:
 *     summary: Retrieve leave applications
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Submit a leave application (Students, Teachers, Staff)
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 */
leaveRouter.get('/', protect, getLeaves);
leaveRouter.post('/', protect, applyLeave);

/**
 * @openapi
 * /leaves/{id}/status:
 *   put:
 *     summary: Approve or Reject leave application (Admin/HR)
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 */
leaveRouter.put('/:id/status', protect, authorize('super_admin', 'admin', 'principal', 'hr'), updateLeaveStatus);
