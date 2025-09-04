// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'restaurant_owner' | 'staff';
  loyaltyPoints: number;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface Ingredient {
  id: string;
  name: string;
  category: 'protein' | 'vegetable' | 'dairy' | 'grain' | 'spice' | 'beverage' | 'other';
  unit: 'kg' | 'g' | 'l' | 'ml' | 'pieces' | 'cups' | 'tbsp' | 'tsp';
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
  supplier?: string;
  expiryDate?: string;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  isRequired: boolean; // If true, item becomes unavailable when ingredient is out of stock
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'debit_card' | 'mobile_money' | 'cash';
  last4?: string;
  brand?: string;
  provider?: 'visa' | 'mastercard' | 'mtn' | 'vodafone' | 'airteltigo';
  isDefault: boolean;
}

export interface UserPreferences {
  language: 'en' | 'tw' | 'fr';
  darkMode: boolean;
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    chat: boolean;
  };
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  image: string;
  banner: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  phone: string;
  ownerId: string;
  menu: MenuCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dietaryTags: DietaryTag[];
  customizations: Customization[];
  isAvailable: boolean;
  preparationTime: number;
  order: number;
  ingredients: MenuItemIngredient[];
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DietaryTag {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Customization {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress: Address;
  estimatedDelivery: string;
  actualDelivery?: string;
  notes?: string;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations: SelectedCustomization[];
  total: number;
}

export interface SelectedCustomization {
  customizationId: string;
  optionIds: string[];
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

// Chat Types
export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderType: 'customer' | 'chef' | 'system';
  message: string;
  type: 'text' | 'image' | 'system';
  timestamp: string;
  read: boolean;
}

export interface ChatRoom {
  orderId: string;
  participants: {
    customerId: string;
    restaurantId: string;
  };
  lastMessage?: ChatMessage;
  unreadCount: number;
}

// Loyalty Types
export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem';
  points: number;
  orderId?: string;
  description: string;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
}

// QR Code Types
export interface QRCodeData {
  type: 'restaurant' | 'table';
  restaurantId: string;
  tableNumber?: number;
  deepLink: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  RestaurantOwnerDashboard: undefined;
  MenuManagement: undefined;
  RestaurantSettings: undefined;
  Restaurant: { restaurantId: string };
  MenuItem: { menuItem: MenuItem };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId: string };
  Chat: { orderId: string };
  QRScan: undefined;
  Profile: undefined;
  Loyalty: undefined;
  RestaurantDashboard: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  RestaurantLogin: undefined;
  RestaurantRegister: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Chat: undefined;
  Profile: undefined;
};

// Redux State Types
export interface RootState {
  auth: AuthState;
  restaurants: RestaurantsState;
  cart: CartState;
  orders: OrdersState;
  chat: ChatState;
  loyalty: LoyaltyState;
  app: AppState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RestaurantsState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  menu: MenuCategory[];
  isLoading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  loyaltyPointsUsed: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: SelectedCustomization[];
  total: number;
}

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatState {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface LoyaltyState {
  points: number;
  transactions: LoyaltyTransaction[];
  rewards: LoyaltyReward[];
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'tw' | 'fr';
  isOnline: boolean;
  isLoading: boolean;
}