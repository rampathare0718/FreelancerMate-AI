import User from '../models/User.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;

    // Validate presence of required fields
    if (!name || !email || age === undefined || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, age, password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      age: Number(age),
      password
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public (for initial setup verification)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Authenticate user & login
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user with password included
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        title: user.title,
        phone: user.phone,
        bio: user.bio,
        location: user.location,
        hourlyRate: user.hourlyRate,
        currency: user.currency,
        warrantyDays: user.warrantyDays,
        proposalSignoff: user.proposalSignoff,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Public
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      title,
      phone,
      bio,
      location,
      hourlyRate,
      currency,
      warrantyDays,
      proposalSignoff,
      proposalTone
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (title !== undefined) user.title = title.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (location !== undefined) user.location = location.trim();
    if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;
    if (currency !== undefined) user.currency = currency;
    if (warrantyDays !== undefined) user.warrantyDays = Number(warrantyDays);
    if (proposalSignoff !== undefined) user.proposalSignoff = proposalSignoff.trim();
    if (proposalTone !== undefined) user.proposalTone = proposalTone;

    const updated = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        age: updated.age,
        title: updated.title,
        phone: updated.phone,
        bio: updated.bio,
        location: updated.location,
        hourlyRate: updated.hourlyRate,
        currency: updated.currency,
        warrantyDays: updated.warrantyDays,
        proposalSignoff: updated.proposalSignoff,
        proposalTone: updated.proposalTone,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


