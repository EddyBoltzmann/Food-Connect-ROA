import { TransitionSpec, CardStyleInterpolator } from '@react-navigation/stack';

// Custom transition configurations
export const slideFromRight: CardStyleInterpolator = ({ current, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  };
};

export const slideFromBottom: CardStyleInterpolator = ({ current, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
      ],
    },
  };
};

export const fadeIn: CardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

export const scaleIn: CardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      transform: [
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        },
      ],
      opacity: current.progress,
    },
  };
};

export const slideFromLeft: CardStyleInterpolator = ({ current, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-layouts.screen.width, 0],
          }),
        },
      ],
    },
  };
};

export const modalSlideUp: CardStyleInterpolator = ({ current, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
  };
};

// Transition timing configurations
export const fastTransition: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 250,
  },
};

export const smoothTransition: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 350,
  },
};

export const slowTransition: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 500,
  },
};

export const springTransition: TransitionSpec = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

// Screen-specific transition configurations
export const screenTransitions = {
  // Auth screens
  Login: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  Register: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  ForgotPassword: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  
  // Main screens
  Home: {
    cardStyleInterpolator: fadeIn,
    transitionSpec: fastTransition,
  },
  Restaurant: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  MenuItem: {
    cardStyleInterpolator: modalSlideUp,
    transitionSpec: springTransition,
  },
  Cart: {
    cardStyleInterpolator: slideFromBottom,
    transitionSpec: springTransition,
  },
  Checkout: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  OrderTracking: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  Chat: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  QRScan: {
    cardStyleInterpolator: slideFromBottom,
    transitionSpec: springTransition,
  },
  Profile: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  Loyalty: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  RestaurantDashboard: {
    cardStyleInterpolator: slideFromRight,
    transitionSpec: smoothTransition,
  },
  
  // Modal screens
  Onboarding: {
    cardStyleInterpolator: fadeIn,
    transitionSpec: slowTransition,
  },
};