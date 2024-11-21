import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  KeyboardTypeOptions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: string;
  error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon,
  error,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textDark }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          { 
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Feather name={icon} size={20} color={colors.textLight} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: colors.textDark }]}
          placeholderTextColor={colors.textLight}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
});

export default AuthInput; 