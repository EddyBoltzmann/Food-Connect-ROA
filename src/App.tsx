import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

// Import store and theme
import { store, persistor } from './store';
import { lightTheme, darkTheme } from './theme';

// Import navigation
import AppNavigator from './navigation/AppNavigator';

// Import services
import { socketService } from './services/socketService';

// Import components
import LoadingScreen from './components/common/LoadingScreen';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize socket connection
    socketService.connect();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider theme={lightTheme}>
            <StatusBar
              barStyle="light-content"
              backgroundColor="#2ECC71"
              translucent={Platform.OS === 'android'}
            />
            <AppNavigator />
            <Toast />
          </ThemeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;