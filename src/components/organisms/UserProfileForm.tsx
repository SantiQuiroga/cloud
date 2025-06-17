'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { FormField } from '@/components/molecules/FormField';
import { LoadingButton } from '@/components/molecules/LoadingButton';
import { MessageDisplay } from '@/components/molecules/MessageDisplay';
import { userProfileSchema, UserProfileFormData } from '@/shared/utils/validations';

interface UserProfileFormProps {
  initialData?: Partial<UserProfileFormData>;
  onSubmit: (data: UserProfileFormData) => Promise<void>;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function UserProfileForm({
  initialData,
  onSubmit,
  loading = false,
  title = 'Datos del Perfil',
  description = 'Completa tu información personal'
}: UserProfileFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      address: initialData?.address || '',
      birthDate: initialData?.birthDate || ''
    }
  });

  const handleFormSubmit = async (data: UserProfileFormData) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await onSubmit(data);
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el perfil');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            label="Dirección"
            placeholder="Tu dirección completa"
            error={errors.address?.message}
            disabled={submitting || loading}
            required
            {...register('address')}
          />

          <FormField
            label="Fecha de Nacimiento"
            type="date"
            error={errors.birthDate?.message}
            disabled={submitting || loading}
            required
            {...register('birthDate')}
          />

          <LoadingButton
            type="submit"
            loading={submitting}
            disabled={loading}
            loadingText="Guardando..."
            className="w-full"
          >
            Guardar Información
          </LoadingButton>
        </form>

        {error && <MessageDisplay message={error} type="error" className="mt-4" />}
        {success && <MessageDisplay message={success} type="success" className="mt-4" />}
      </CardContent>
    </Card>
  );
}
