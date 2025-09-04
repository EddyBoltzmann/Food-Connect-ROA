# Food Connect - Restaurant Ordering Application

A comprehensive cross-platform restaurant ordering application built with React Native and Node.js, featuring modern UI/UX, real-time chat, QR code integration, and loyalty system.

## 🚀 Features

### Customer Features
- **Modern UI/UX**: Clean, intuitive interface inspired by Uber Eats and DoorDash
- **Restaurant Discovery**: Browse nearby restaurants with search and filtering
- **Menu Browsing**: Detailed menu items with images, descriptions, and dietary tags
- **QR Code Scanning**: Scan QR codes on tables for quick menu access
- **Real-time Order Tracking**: Live updates on order status
- **Chat with Chef**: Direct communication with restaurant staff
- **Loyalty System**: Earn and redeem points for rewards
- **Multiple Payment Options**: Stripe, mobile money, and cash on delivery
- **Multi-language Support**: English, Twi, and French
- **Dark Mode**: Beautiful dark theme support
- **Accessibility**: WCAG 2.1 AA compliant

### Restaurant Owner Features
- **Dashboard**: Complete restaurant management interface
- **Menu Management**: Full CRUD operations for menu items
- **Order Management**: Real-time order tracking and status updates
- **QR Code Generation**: Generate QR codes for tables and restaurant
- **Analytics**: Order insights and performance metrics
- **Staff Management**: Role-based access control

## 🛠 Technology Stack

### Frontend
- **React Native** with TypeScript
- **React Navigation** for navigation
- **Redux Toolkit** for state management
- **Styled Components** for styling
- **React Native Reanimated** for animations
- **Lottie** for complex animations
- **Socket.IO Client** for real-time communication

### Backend
- **Node.js** with Express
- **MongoDB** for database
- **Redis** for caching and sessions
- **Socket.IO** for real-time features
- **JWT** for authentication
- **Stripe** for payments
- **Cloudinary** for image storage
- **QRCode** for QR generation

### Mobile Features
- **Camera Integration** for QR scanning
- **Push Notifications** for order updates
- **Offline Support** with data caching
- **Biometric Authentication** (optional)

## 📱 Screenshots

*Screenshots will be added here showing the app's beautiful UI*

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 16.0.0)
- React Native development environment
- MongoDB
- Redis
- iOS Simulator / Android Emulator or physical device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/food-connect.git
   cd food-connect
   ```

2. **Install dependencies**
   ```bash
   # Install React Native dependencies
   npm install
   
   # Install iOS dependencies (macOS only)
   cd ios && pod install && cd ..
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Update .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB
   mongod
   
   # Start Redis
   redis-server
   ```

5. **Start the application**
   ```bash
   # Start backend server
   cd backend && npm run dev
   
   # Start React Native app (in another terminal)
   npm start
   
   # Run on iOS
   npm run ios
   
   # Run on Android
   npm run android
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/foodconnect

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Social Login
GOOGLE_CLIENT_ID=your-google-client-id
FACEBOOK_APP_ID=your-facebook-app-id
```

## 📱 Mobile Setup

### iOS Setup
1. Install Xcode and iOS Simulator
2. Install CocoaPods: `sudo gem install cocoapods`
3. Run `cd ios && pod install`
4. Open `ios/FoodConnect.xcworkspace` in Xcode
5. Build and run the project

### Android Setup
1. Install Android Studio and Android SDK
2. Set up Android emulator or connect physical device
3. Run `npm run android`

## 🏗 Project Structure

```
food-connect/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components (Button, Input, etc.)
│   │   ├── home/           # Home screen components
│   │   └── restaurant/     # Restaurant screen components
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── tabs/           # Tab navigation screens
│   │   └── ...             # Other screens
│   ├── navigation/         # Navigation configuration
│   ├── store/              # Redux store and slices
│   ├── services/           # API and external services
│   ├── types/              # TypeScript type definitions
│   └── theme/              # Theme and styling
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── socket/         # Socket.IO handlers
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/social` - Social login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/nearby` - Get nearby restaurants

### Menu
- `GET /api/menu/:restaurantId` - Get restaurant menu
- `POST /api/menu` - Create menu item (owner only)
- `PUT /api/menu/:id` - Update menu item (owner only)
- `DELETE /api/menu/:id` - Delete menu item (owner only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

### QR Codes
- `GET /api/qr/restaurant/:id` - Generate restaurant QR code
- `POST /api/qr/table` - Generate table QR code
- `POST /api/qr/decode` - Decode QR code data

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or self-hosted MongoDB
2. Set up Redis cloud or self-hosted Redis
3. Deploy to AWS ECS, Google Cloud Run, or similar
4. Configure environment variables
5. Set up CI/CD pipeline

### Mobile App Deployment
1. **iOS**: Build and upload to App Store Connect
2. **Android**: Build and upload to Google Play Console

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from Uber Eats, DoorDash, and Glovo
- Icons from Material Icons
- Images from Unsplash
- Community contributors and testers

## 📞 Support

For support, email support@foodconnect.app or join our Slack channel.

## 🔮 Roadmap

- [ ] Voice ordering
- [ ] AI-powered recommendations
- [ ] Multi-restaurant ordering
- [ ] Delivery tracking with maps
- [ ] Restaurant analytics dashboard
- [ ] Social features and reviews
- [ ] Subscription plans for restaurants
- [ ] Integration with food delivery services

---

Made with ❤️ by the Food Connect team