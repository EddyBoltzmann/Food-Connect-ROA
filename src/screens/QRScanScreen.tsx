import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Text,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type QRScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QRScan'>;

const Container = styled.View`
  flex: 1;
  background-color: #000000;
`;

const CameraContainer = styled.View`
  flex: 1;
  position: relative;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

const ScanArea = styled.View`
  width: ${width * 0.7}px;
  height: ${width * 0.7}px;
  border-width: 2px;
  border-color: #2ECC71;
  border-radius: 20px;
  background-color: transparent;
`;

const Corner = styled.View<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }>`
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: #2ECC71;
  border-width: 4px;
  ${({ position }) => {
    switch (position) {
      case 'top-left':
        return `
          top: -2px;
          left: -2px;
          border-right-width: 0;
          border-bottom-width: 0;
          border-top-left-radius: 20px;
        `;
      case 'top-right':
        return `
          top: -2px;
          right: -2px;
          border-left-width: 0;
          border-bottom-width: 0;
          border-top-right-radius: 20px;
        `;
      case 'bottom-left':
        return `
          bottom: -2px;
          left: -2px;
          border-right-width: 0;
          border-top-width: 0;
          border-bottom-left-radius: 20px;
        `;
      case 'bottom-right':
        return `
          bottom: -2px;
          right: -2px;
          border-left-width: 0;
          border-top-width: 0;
          border-bottom-right-radius: 20px;
        `;
    }
  }}
`;

const InstructionsContainer = styled.View`
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  align-items: center;
  padding: 0 40px;
`;

const InstructionsText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  text-align: center;
  margin-bottom: 8px;
  font-weight: 500;
`;

const SubInstructionsText = styled.Text`
  color: #FFFFFF;
  font-size: 14px;
  text-align: center;
  opacity: 0.8;
`;

const HeaderContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-top: 50px;
  padding-horizontal: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const HeaderButton = styled(TouchableOpacity)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 600;
`;

const FlashButton = styled(TouchableOpacity)`
  position: absolute;
  top: 50px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const QRScanScreen: React.FC = () => {
  const navigation = useNavigation<QRScanScreenNavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    // Request camera permission
    const getCameraPermissions = async () => {
      try {
        const { status } = await RNCamera.requestCameraPermission();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Camera permission error:', error);
        setHasPermission(false);
      }
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      // Parse QR code data
      const qrData = JSON.parse(data);
      
      if (qrData.type === 'restaurant' && qrData.restaurantId) {
        // Navigate to restaurant page
        navigation.navigate('Restaurant', { 
          restaurantId: qrData.restaurantId 
        });
      } else {
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not valid for Food Connect.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Invalid QR Code',
        'Unable to read this QR code. Please try again.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (hasPermission === null) {
    return (
      <Container>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
        </View>
      </Container>
    );
  }

  if (hasPermission === false) {
    return (
      <Container>
        <View style={styles.centerContainer}>
          <Icon name="camera-alt" size={64} color="#6B7280" />
          <Text style={styles.errorText}>Camera permission denied</Text>
          <Text style={styles.errorSubText}>
            Please enable camera access in your device settings to scan QR codes.
          </Text>
          <TouchableOpacity style={styles.settingsButton} onPress={goBack}>
            <Text style={styles.settingsButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <CameraContainer>
        <RNCamera
          style={StyleSheet.absoluteFillObject}
          type={RNCamera.Constants.Type.back}
          flashMode={flashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          onBarCodeRead={handleBarCodeScanned}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          captureAudio={false}
        />

        <HeaderContainer>
          <HeaderButton onPress={goBack}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </HeaderButton>
          <HeaderTitle>Scan QR Code</HeaderTitle>
          <View style={{ width: 44 }} />
        </HeaderContainer>

        <FlashButton onPress={toggleFlash}>
          <Icon 
            name={flashOn ? "flash-on" : "flash-off"} 
            size={24} 
            color="#FFFFFF" 
          />
        </FlashButton>

        <Overlay>
          <ScanArea>
            <Corner position="top-left" />
            <Corner position="top-right" />
            <Corner position="bottom-left" />
            <Corner position="bottom-right" />
          </ScanArea>
        </Overlay>

        <InstructionsContainer>
          <InstructionsText>Position the QR code within the frame</InstructionsText>
          <SubInstructionsText>
            Make sure the QR code is clearly visible and well-lit
          </SubInstructionsText>
        </InstructionsContainer>
      </CameraContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
  },
  settingsButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QRScanScreen;