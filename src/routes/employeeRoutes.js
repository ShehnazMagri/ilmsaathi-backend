import express from 'express';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employeeController.js';
import { protect } from '../middleware/auth.js';

export const employeeRouter = express.Router();

employeeRouter.get('/', protect, getEmployees);
employeeRouter.post('/', protect, createEmployee);
employeeRouter.put('/:id', protect, updateEmployee);
employeeRouter.delete('/:id', protect, deleteEmployee);
