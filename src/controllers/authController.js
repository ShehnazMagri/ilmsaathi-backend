import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import { generateResetPasswordEmailTemplate } from '../utils/emailTemplates.js';

// Helper to send token response with cookie
const sendTokenResponse = (user, statusCode, res, message) => {
  const tokenPayload = {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'supersecretkey123', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });

  const options = {
    expires: new Date(Date.now() + (Number(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone
      }
    });
};

// @desc    Register user (Strictly stores user inside MongoDB database)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    let existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password,
      role: role || 'student'
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully..',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user (Validates strictly against MongoDB database records)
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    return sendTokenResponse(user, 200, res, 'Logged in successfully.');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user (/api/auth/me)
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/update-profile
export const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = Object.fromEntries(
      Object.entries({
        name: req.body.name,
        email: req.body.email?.toLowerCase(),
        phone: req.body.phone,
        avatar: req.body.avatar
      }).filter(([, value]) => value !== undefined)
    );

    if (!fieldsToUpdate.name || !fieldsToUpdate.email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const duplicateUser = await User.findOne({ email: fieldsToUpdate.email, _id: { $ne: req.user.id } });
    if (duplicateUser) {
      return res.status(400).json({ success: false, message: 'This email address is already in use.' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    if (!user) return res.status(404).json({ success: false, message: 'User record not found.' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.'
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').trim().replace(/\/+$/, '');
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
    const message = `You requested a password reset for your IlmSaathi School ERP account. Please click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 10 minutes.\n\nBest regards,\nIlmSaathi School ERP Team`;
    const html = generateResetPasswordEmailTemplate(user.name, resetUrl);

    try {
      await sendEmail({
        email: user.email,
        subject: 'IlmSaathi Password Reset Instructions',
        message,
        html
      });
      res.json({ success: true, message: 'Password reset link sent to your registered email address.' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Unable to process your request right now. Please try again later' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resettoken
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'This password reset link is invalid or has expired' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password has been reset successfully.');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout
// @route   GET /api/auth/logout
export const logout = (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
};
