'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { FormField } from '@/components/molecules/FormField';
import { LoadingButton } from '@/components/molecules/LoadingButton';
import { MessageDisplay } from '@/components/molecules/MessageDisplay';
import { authSchema, AuthFormData } from '@/shared/utils/validations';

interface AuthFormProps {
  onSignIn: (data: AuthFormData) => Promise<void>;
  onSignUp: (data: AuthFormData) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onFacebookSignIn: () => Promise<void>;
  loading?: boolean;
}

export function AuthForm({
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  onFacebookSignIn,
  loading = false
}: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  const handleFormSubmit = async (data: AuthFormData) => {
    setSubmitting(true);
    setError('');

    try {
      if (isSignUp) {
        await onSignUp(data);
      } else {
        await onSignIn(data);
      }
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    setError('');
    try {
      if (provider === 'google') {
        await onGoogleSignIn();
      } else {
        await onFacebookSignIn();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            disabled={submitting || loading}
            required
            {...register('email')}
          />

          <FormField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={submitting || loading}
            required
            {...register('password')}
          />

          <div className="space-y-3">
            <LoadingButton
              type="submit"
              loading={submitting}
              disabled={loading}
              loadingText={isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
              className="w-full"
            >
              {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </LoadingButton>

            <LoadingButton
              type="button"
              variant="outline"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={submitting || loading}
              className="w-full"
            >
              {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </LoadingButton>
          </div>
        </form>

        <div className="space-y-3">
          <LoadingButton
            variant="outline"
            onClick={() => handleSocialSignIn('google')}
            disabled={submitting || loading}
            className="w-full"
          >
            Continuar con Google
          </LoadingButton>

          <LoadingButton
            variant="outline"
            onClick={() => handleSocialSignIn('facebook')}
            disabled={submitting || loading}
            className="w-full"
          >
            Continuar con Facebook
          </LoadingButton>
        </div>

        {error && <MessageDisplay message={error} type="error" />}
      </CardContent>
    </Card>
  );
}
