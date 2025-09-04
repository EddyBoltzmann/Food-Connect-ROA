import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Text } from './Text';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  maxLength?: number;
  required?: boolean;
}

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const InputContainer = styled.View<{ error: boolean; focused: boolean; disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, disabled }) => 
    disabled ? theme.colors.neutral.lightGray : theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme, error, focused }) => {
    if (error) return theme.colors.status.error;
    if (focused) return theme.colors.primary;
    return theme.colors.border.light;
  }};
  padding: ${({ theme }) => theme.spacing.md}px;
  min-height: 48px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const StyledTextInput = styled(TextInput)<{ hasLeftIcon: boolean; hasRightIcon: boolean }>`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0;
  margin-left: ${({ hasLeftIcon, theme }) => (hasLeftIcon ? theme.spacing.sm : 0)}px;
  margin-right: ${({ hasRightIcon, theme }) => (hasRightIcon ? theme.spacing.sm : 0)}px;
`;

const IconContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const ErrorContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  maxLength,
  required = false,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setShowPassword(!showPassword);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const rightIconName = secureTextEntry 
    ? (showPassword ? 'visibility' : 'visibility-off')
    : rightIcon;

  return (
    <Container>
      {label && (
        <LabelContainer>
          <Text variant="label" weight="medium">
            {label}
          </Text>
          {required && (
            <Text variant="label" color="error" style={{ marginLeft: 4 }}>
              *
            </Text>
          )}
        </LabelContainer>
      )}
      
      <InputContainer 
        error={!!error} 
        focused={focused} 
        disabled={disabled}
      >
        {leftIcon && (
          <IconContainer>
            <Icon 
              name={leftIcon} 
              size={20} 
              color="#6B7280" 
            />
          </IconContainer>
        )}
        
        <StyledTextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          hasLeftIcon={!!leftIcon}
          hasRightIcon={!!rightIconName}
        />
        
        {rightIconName && (
          <TouchableOpacity onPress={handleRightIconPress}>
            <IconContainer>
              <Icon 
                name={rightIconName} 
                size={20} 
                color="#6B7280" 
              />
            </IconContainer>
          </TouchableOpacity>
        )}
      </InputContainer>
      
      {error && (
        <ErrorContainer>
          <Text variant="caption" color="error">
            {error}
          </Text>
        </ErrorContainer>
      )}
    </Container>
  );
};