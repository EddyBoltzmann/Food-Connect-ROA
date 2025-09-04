const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['card', 'mobile_money', 'cash'],
    required: true
  },
  last4: String,
  brand: String,
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userPreferencesSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['en', 'tw', 'fr'],
    default: 'en'
  },
  darkMode: {
    type: Boolean,
    default: false
  },
  notifications: {
    orderUpdates: {
      type: Boolean,
      default: true
    },
    promotions: {
      type: Boolean,
      default: true
    },
    chat: {
      type: Boolean,
      default: true
    }
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant_owner', 'staff'],
    default: 'customer'
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points cannot be negative']
  },
  addresses: [addressSchema],
  paymentMethods: [paymentMethodSchema],
  preferences: {
    type: userPreferencesSchema,
    default: () => ({})
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

// Pre-remove middleware to handle related data
userSchema.pre('remove', async function(next) {
  // TODO: Handle related data cleanup (orders, reviews, etc.)
  next();
});

module.exports = mongoose.model('User', userSchema);