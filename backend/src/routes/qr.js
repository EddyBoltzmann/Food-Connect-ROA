const express = require('express');
const QRCode = require('qrcode');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @desc    Generate QR code for restaurant
// @route   GET /api/qr/restaurant/:restaurantId
// @access  Public
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { tableNumber } = req.query;

    // Find restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Create QR code data
    const qrData = {
      type: 'restaurant',
      restaurantId: restaurantId,
      tableNumber: tableNumber ? parseInt(tableNumber) : null,
      deepLink: `foodconnect://restaurant/${restaurantId}${tableNumber ? `?table=${tableNumber}` : ''}`,
      timestamp: new Date().toISOString()
    };

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#2ECC71',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    res.status(200).json({
      success: true,
      qrCode: qrCodeDataURL,
      data: qrData,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Generate QR code for table
// @route   POST /api/qr/table
// @access  Private (Restaurant Owner)
router.post('/table', authMiddleware.protect, authMiddleware.restrictTo('restaurant_owner'), async (req, res) => {
  try {
    const { restaurantId, tableNumber } = req.body;

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId: req.user.id
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found or you do not have permission'
      });
    }

    // Create QR code data
    const qrData = {
      type: 'table',
      restaurantId: restaurantId,
      tableNumber: parseInt(tableNumber),
      deepLink: `foodconnect://restaurant/${restaurantId}?table=${tableNumber}`,
      timestamp: new Date().toISOString()
    };

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#2ECC71',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    res.status(200).json({
      success: true,
      qrCode: qrCodeDataURL,
      data: qrData,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate table QR code',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Generate multiple QR codes for restaurant tables
// @route   POST /api/qr/tables/bulk
// @access  Private (Restaurant Owner)
router.post('/tables/bulk', authMiddleware.protect, authMiddleware.restrictTo('restaurant_owner'), async (req, res) => {
  try {
    const { restaurantId, tableNumbers } = req.body;

    if (!Array.isArray(tableNumbers) || tableNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Table numbers array is required'
      });
    }

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      ownerId: req.user.id
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found or you do not have permission'
      });
    }

    // Generate QR codes for all tables
    const qrCodes = await Promise.all(
      tableNumbers.map(async (tableNumber) => {
        const qrData = {
          type: 'table',
          restaurantId: restaurantId,
          tableNumber: parseInt(tableNumber),
          deepLink: `foodconnect://restaurant/${restaurantId}?table=${tableNumber}`,
          timestamp: new Date().toISOString()
        };

        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
          width: 300,
          margin: 2,
          color: {
            dark: '#2ECC71',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });

        return {
          tableNumber: parseInt(tableNumber),
          qrCode: qrCodeDataURL,
          data: qrData
        };
      })
    );

    res.status(200).json({
      success: true,
      qrCodes,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate bulk QR codes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Decode QR code data
// @route   POST /api/qr/decode
// @access  Public
router.post('/decode', async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR code data is required'
      });
    }

    let decodedData;
    try {
      decodedData = JSON.parse(qrData);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code data format'
      });
    }

    // Validate QR code data structure
    if (!decodedData.type || !decodedData.restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code data structure'
      });
    }

    // Find restaurant
    const restaurant = await Restaurant.findById(decodedData.restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: decodedData,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image,
        isOpen: restaurant.isOpen
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to decode QR code',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;