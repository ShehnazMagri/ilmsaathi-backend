import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

export const authRouter = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user account (Student or Staff)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: Registered successfully
 */
authRouter.post('/register', register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate user & get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: JWT Token returned successfully
 */
authRouter.post('/login', login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details
 */
authRouter.get('/me', protect, getMe);

/**
 * @openapi
 * /auth/update-profile:
 *   put:
 *     summary: Update profile info
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
authRouter.put('/update-profile', protect, updateProfile);

/**
 * @openapi
 * /auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
authRouter.put('/change-password', protect, changePassword);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Authentication]
 */
authRouter.post('/forgot-password', forgotPassword);

/**
 * @openapi
 * /auth/reset-password/{resettoken}:
 *   put:
 *     summary: Reset password with token
 *     tags: [Authentication]
 */
authRouter.put('/reset-password/:resettoken', resetPassword);

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     summary: Clear auth session cookie
 *     tags: [Authentication]
 */
authRouter.get('/logout', logout);
