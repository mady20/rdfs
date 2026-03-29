const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { ROLES } = require('../utils/constants');
const { validateUserCreation } = require('../utils/validators');

// Create distributor (admin only)
const createDistributor = async (req, res) => {
  try {
    const { name, email, password, phone, commissionPercent = 0, address = '' } = req.body;

    const errors = validateUserCreation({ name, email, password, phone });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    const distributor = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: ROLES.DISTRIBUTOR,
      commissionPercent,
      address,
      createdBy: req.user._id,
    });

    await distributor.save();

    // Create wallet
    await Wallet.create({
      user: distributor._id,
      balance: 0,
      currency: 'INR',
    });

    const response = distributor.toObject();
    delete response.password;

    res.status(201).json({
      success: true,
      message: 'Distributor created successfully',
      data: response,
    });
  } catch (error) {
    console.error('Create distributor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create distributor',
    });
  }
};

// Create retailer (admin or distributor)
const createRetailer = async (req, res) => {
  try {
    const { name, email, password, phone, commissionPercent = 0, address = '', parentDistributor } = req.body;

    const errors = validateUserCreation({ name, email, password, phone });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    let retailerParentDistributor = parentDistributor;

    // If created by distributor, set parent distributor to self
    if (req.user.role === ROLES.DISTRIBUTOR) {
      retailerParentDistributor = req.user._id;
    }

    // Validate parent distributor if provided
    if (retailerParentDistributor) {
      const parentDist = await User.findById(retailerParentDistributor);
      if (!parentDist || parentDist.role !== ROLES.DISTRIBUTOR) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent distributor',
        });
      }
    }

    const retailer = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: ROLES.RETAILER,
      parentDistributor: retailerParentDistributor,
      commissionPercent,
      address,
      createdBy: req.user._id,
    });

    await retailer.save();

    // Create wallet
    await Wallet.create({
      user: retailer._id,
      balance: 0,
      currency: 'INR',
    });

    const response = retailer.toObject();
    delete response.password;

    res.status(201).json({
      success: true,
      message: 'Retailer created successfully',
      data: response,
    });
  } catch (error) {
    console.error('Create retailer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create retailer',
    });
  }
};

// Get all distributors (admin only)
const getDistributors = async (req, res) => {
  try {
    const distributors = await User.find({ role: ROLES.DISTRIBUTOR }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Distributors fetched successfully',
      data: {
        items: distributors,
        total: distributors.length,
      },
    });
  } catch (error) {
    console.error('Get distributors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch distributors',
    });
  }
};

// Get retailers (admin sees all, distributor sees only their retailers)
const getRetailers = async (req, res) => {
  try {
    let query = { role: ROLES.RETAILER };

    if (req.user.role === ROLES.DISTRIBUTOR) {
      query.parentDistributor = req.user._id;
    }

    const retailers = await User.find(query)
      .select('-password')
      .populate('parentDistributor', 'name email');

    res.status(200).json({
      success: true,
      message: 'Retailers fetched successfully',
      data: {
        items: retailers,
        total: retailers.length,
      },
    });
  } catch (error) {
    console.error('Get retailers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch retailers',
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').populate('parentDistributor', 'name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check permissions
    if (req.user.role === ROLES.DISTRIBUTOR && user.role === ROLES.RETAILER) {
      if (user.parentDistributor._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    } else if (req.user.role === ROLES.RETAILER) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, commissionPercent, isActive, parentDistributor } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check permissions
    if (req.user.role === ROLES.DISTRIBUTOR) {
      if (user.role !== ROLES.RETAILER || user.parentDistributor.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    } else if (req.user.role === ROLES.RETAILER) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (commissionPercent !== undefined) user.commissionPercent = commissionPercent;
    if (isActive !== undefined) user.isActive = isActive;

    // Only admin can change parentDistributor
    if (parentDistributor !== undefined && req.user.role === ROLES.ADMIN) {
      if (parentDistributor) {
        const parentDist = await User.findById(parentDistributor);
        if (!parentDist || parentDist.role !== ROLES.DISTRIBUTOR) {
          return res.status(400).json({
            success: false,
            message: 'Invalid parent distributor',
          });
        }
      }
      user.parentDistributor = parentDistributor;
    }

    user.updatedAt = Date.now();
    await user.save();

    const response = user.toObject();
    delete response.password;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: response,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if distributor has retailers
    if (user.role === ROLES.DISTRIBUTOR) {
      const retailerCount = await User.countDocuments({ parentDistributor: id });
      if (retailerCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete distributor with assigned retailers',
        });
      }
    }

    await User.findByIdAndDelete(id);
    await Wallet.findOneAndDelete({ user: id });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check permissions
    if (req.user.role === ROLES.DISTRIBUTOR) {
      if (user.role !== ROLES.RETAILER || user.parentDistributor.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    } else if (req.user.role === ROLES.RETAILER) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    user.isActive = isActive;
    user.updatedAt = Date.now();
    await user.save();

    const response = user.toObject();
    delete response.password;

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: response,
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
    });
  }
};

// Assign retailer to distributor (admin only)
const assignRetailerToDistributor = async (req, res) => {
  try {
    const { id } = req.params;
    const { parentDistributor } = req.body;

    const user = await User.findById(id);
    if (!user || user.role !== ROLES.RETAILER) {
      return res.status(400).json({
        success: false,
        message: 'User is not a retailer',
      });
    }

    if (parentDistributor) {
      const distributor = await User.findById(parentDistributor);
      if (!distributor || distributor.role !== ROLES.DISTRIBUTOR) {
        return res.status(400).json({
          success: false,
          message: 'Invalid distributor',
        });
      }
    }

    user.parentDistributor = parentDistributor;
    user.updatedAt = Date.now();
    await user.save();

    const response = user.toObject();
    delete response.password;

    res.status(200).json({
      success: true,
      message: 'Retailer assigned successfully',
      data: response,
    });
  } catch (error) {
    console.error('Assign retailer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign retailer',
    });
  }
};

module.exports = {
  createDistributor,
  createRetailer,
  getDistributors,
  getRetailers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  assignRetailerToDistributor,
};
