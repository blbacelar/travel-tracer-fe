import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useSignUp } from '@clerk/clerk-expo';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import SocialAuthButtons from '../../components/auth/SocialAuthButtons';

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { signUp, setActive, isLoading } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Navigate to verification screen or handle as needed
      // For now, we'll just set the active session
      await setActive({ session: result.createdSessionId });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={colors.textDark} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.textDark }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textLight }]}>
              Join us and start your journey
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail"
            />

            <AuthInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              icon="lock"
            />

            <AuthInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              icon="lock"
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <View style={styles.passwordRequirements}>
              <Text style={[styles.requirementsTitle, { color: colors.textDark }]}>
                Password must contain:
              </Text>
              <Text style={[styles.requirementText, { color: colors.textLight }]}>
                • At least 8 characters
              </Text>
              <Text style={[styles.requirementText, { color: colors.textLight }]}>
                • One uppercase letter
              </Text>
              <Text style={[styles.requirementText, { color: colors.textLight }]}>
                • One number
              </Text>
              <Text style={[styles.requirementText, { color: colors.textLight }]}>
                • One special character
              </Text>
            </View>

            <AuthButton
              title="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
            />
          </View>

          <SocialAuthButtons />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textLight }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  backButton: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
  },
  form: {
    gap: SPACING.md,
  },
  passwordRequirements: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  requirementsTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  requirementText: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs / 2,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.md,
  },
  footerLink: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default RegisterScreen; 