const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const dietaryTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});

const customizationOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const customizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['single', 'multiple'],
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [customizationOptionSchema]
});

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuCategory',
    required: true
  },
  dietaryTags: [dietaryTagSchema],
  customizations: [customizationSchema],
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 15,
    min: [1, 'Preparation time must be at least 1 minute']
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  cuisine: [{
    type: String,
    required: true,
    trim: true
  }],
  image: {
    type: String,
    required: [true, 'Restaurant image is required']
  },
  banner: {
    type: String,
    required: [true, 'Banner image is required']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required'],
    trim: true
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    min: [0, 'Delivery fee cannot be negative']
  },
  minimumOrder: {
    type: Number,
    required: [true, 'Minimum order amount is required'],
    min: [0, 'Minimum order cannot be negative']
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Invalid latitude'],
      max: [90, 'Invalid latitude']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Invalid longitude'],
      max: [180, 'Invalid longitude']
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  menu: [menuItemSchema],
  operatingHours: {
    monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    sunday: { open: String, close: String, isOpen: { type: Boolean, default: true } }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
restaurantSchema.index({ name: 'text', description: 'text', cuisine: 'text' });
restaurantSchema.index({ coordinates: '2dsphere' });
restaurantSchema.index({ ownerId: 1 });
restaurantSchema.index({ isActive: 1, isOpen: 1 });
restaurantSchema.index({ rating: -1 });

// Virtual for average rating
restaurantSchema.virtual('averageRating').get(function() {
  return this.rating;
});

// Virtual for total menu items
restaurantSchema.virtual('totalMenuItems').get(function() {
  return this.menu.filter(item => item.isActive).length;
});

// Method to check if restaurant is currently open
restaurantSchema.methods.isCurrentlyOpen = function() {
  if (!this.isOpen) return false;
  
  const now = new Date();
  const dayOfWeek = now.toLocaleLowerCase().slice(0, 3) + 'day';
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = this.operatingHours[dayOfWeek];
  if (!todayHours || !todayHours.isOpen) return false;
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Method to get available menu items
restaurantSchema.methods.getAvailableMenu = function() {
  return this.menu.filter(item => item.isActive && item.isAvailable);
};

// Static method to find nearby restaurants
restaurantSchema.statics.findNearby = function(latitude, longitude, maxDistance = 10000) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true
  });
};

// Pre-save middleware to update rating
restaurantSchema.pre('save', function(next) {
  // TODO: Calculate average rating from reviews
  next();
});

// Pre-remove middleware to handle related data
restaurantSchema.pre('remove', async function(next) {
  // TODO: Handle related data cleanup (orders, reviews, etc.)
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);