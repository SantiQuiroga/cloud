'use client';

import { AuthForm } from '@/components/organisms/AuthForm';
import { AuthPageTemplate } from '@/components/templates/AuthPageTemplate';
import { AuthService } from './services/authService';
import { AuthFormData } from '@/shared/utils/validations';

export function AuthPage() {
  const handleSignIn = async (data: AuthFormData) => {
    await AuthService.signInWithEmail(data.email, data.password);
  };

  const handleSignUp = async (data: AuthFormData) => {
    await AuthService.signUpWithEmail(data.email, data.password);
  };

  const handleGoogleSignIn = async () => {
    await AuthService.signInWithGoogle();
  };

  const handleFacebookSignIn = async () => {
    await AuthService.signInWithFacebook();
  };

  return (
    <AuthPageTemplate>
      <AuthForm
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onGoogleSignIn={handleGoogleSignIn}
        onFacebookSignIn={handleFacebookSignIn}
      />
    </AuthPageTemplate>
  );
}
