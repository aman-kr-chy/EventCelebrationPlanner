import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    if (user) {
      generateToken(res, user._id);

      // Send a beautiful welcome email with a quote
      try {
        const welcomeHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #8b5cf6; text-align: center;">Welcome to Event Planner, ${user.name}! 🎉</h2>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              We are absolutely thrilled to have you join our community. Whether you're planning a dream wedding, a corporate gala, or a milestone birthday, we are here to make your celebrations truly unforgettable.
            </p>
            <div style="background-color: #f9f5ff; padding: 20px; border-left: 5px solid #8b5cf6; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <p style="font-style: italic; color: #444; font-size: 18px; margin: 0 0 10px 0;">
                "The more you praise and celebrate your life, the more there is in life to celebrate."
              </p>
              <strong style="color: #8b5cf6;">– Oprah Winfrey</strong>
            </div>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Start exploring our top-rated venues and expert vendors today, and let's bring your vision to life!
            </p>
            <div style="text-align: center; margin-top: 35px; margin-bottom: 15px;">
              <a href="http://localhost:5173" style="background-color: #8b5cf6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Let's Start Planning</a>
            </div>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 30px;">
            <p style="text-align: center; color: #888; font-size: 12px;">
              © ${new Date().getFullYear()} Event Celebration Planner. All rights reserved.
            </p>
          </div>
        `;

        await sendEmail({
          email: user.email,
          subject: 'Welcome to Event Celebration Planner! 🎉',
          html: welcomeHtml,
          message: `Welcome to Event Celebration Planner, ${user.name}! "The more you praise and celebrate your life, the more there is in life to celebrate." – Oprah Winfrey`
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
