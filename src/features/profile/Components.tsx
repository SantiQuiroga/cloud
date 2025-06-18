'use client';

import { useState } from 'react';
import { User, AuthProvider } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { Button } from '@/components/atoms/Button';
import { LoadingButton } from '@/components/molecules/LoadingButton';
import { MessageDisplay } from '@/components/molecules/MessageDisplay';
import { ProfilePageTemplate } from '@/components/templates/ProfilePageTemplate';
import { UserProfileForm } from '@/components/organisms/UserProfileForm';
import { PostsManager } from '../posts/Components';
import { PhotoUploadManager } from '../photo-upload/Components';
import { useUserProfile } from './hooks/useUserProfile';
import { AuthService } from '../auth/services/authService';
import { googleProvider, facebookProvider } from '@/lib/firebase';
import { CalendarDays, MapPin, User as UserIcon, Mail } from 'lucide-react';
import { formatDate } from '@/shared/utils';
import type { UserProfile, UserProfileFormData } from './types';

interface ProfilePageProps {
  user: User;
}

interface UserProfileDisplayProps {
  userProfile: UserProfile;
  onEdit: () => void;
}

function UserProfileDisplay({ userProfile, onEdit }: UserProfileDisplayProps) {
  const isProfileComplete = userProfile.address && userProfile.birthDate;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Perfil de Usuario
        </CardTitle>
        <Button onClick={onEdit} variant="outline" size="sm">
          Editar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserIcon className="h-4 w-4" />
              <span>Nombre</span>
            </div>
            <p className="font-medium">{userProfile.displayName}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </div>
            <p className="font-medium">{userProfile.email}</p>
          </div>

          {userProfile.address && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Dirección</span>
              </div>
              <p className="font-medium">{userProfile.address}</p>
            </div>
          )}

          {userProfile.birthDate && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="h-4 w-4" />
                <span>Fecha de Nacimiento</span>
              </div>
              <p className="font-medium">{formatDate(userProfile.birthDate)}</p>
            </div>
          )}

          {userProfile.age && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Edad</span>
              </div>
              <p className="font-medium">{userProfile.age} años</p>
            </div>
          )}
        </div>

        {!isProfileComplete && (
          <MessageDisplay
            message="¡Completa tu perfil! Agrega tu dirección y fecha de nacimiento para tener un perfil completo."
            type="warning"
          />
        )}
      </CardContent>
    </Card>
  );
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [message, setMessage] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { userProfile, loading, error, updateProfileData, createProfile } = useUserProfile(user);

  const handleLinkProvider = async (provider: AuthProvider) => {
    try {
      await AuthService.linkProvider(provider);
      setMessage('¡Proveedor asociado exitosamente!');
    } catch {
      setMessage('Error al asociar proveedor');
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
    } catch {
      setMessage('Error al cerrar sesión');
    }
  };

  const handleProfileUpdate = async (profileData: UserProfileFormData) => {
    try {
      if (userProfile) {
        await updateProfileData(profileData);
        setMessage('¡Perfil actualizado correctamente!');
      } else {
        await createProfile(profileData);
        setMessage('¡Perfil creado correctamente!');
      }
      setIsEditing(false);
    } catch {
      setMessage('Error al guardar el perfil');
    }
  };

  const isProviderLinked = (providerId: string): boolean => {
    return user.providerData.some(provider => provider.providerId === providerId);
  };

  if (loading) {
    return (
      <ProfilePageTemplate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Cargando perfil...</div>
        </div>
      </ProfilePageTemplate>
    );
  }

  if (error) {
    return (
      <ProfilePageTemplate>
        <div className="min-h-screen flex items-center justify-center">
          <MessageDisplay message={error} type="error" />
        </div>
      </ProfilePageTemplate>
    );
  }

  return (
    <ProfilePageTemplate>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
          <TabsTrigger value="posts">Mis Posts</TabsTrigger>
          <TabsTrigger value="photos">Mis Fotos</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div>
            {userProfile && !isEditing ? (
              <UserProfileDisplay
                userProfile={userProfile}
                onEdit={() => setIsEditing(true)}
              />
            ) : (
              <UserProfileForm
                initialData={{
                  address: userProfile?.address || '',
                  birthDate: userProfile?.birthDate || ''
                }}
                onSubmit={handleProfileUpdate}
                loading={loading}
                title={userProfile ? "Editar Perfil" : "Crear Perfil"}
              />
            )}

            {isEditing && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                Configuración de Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Proveedores vinculados:
                </h3>
                <ul className="space-y-1">
                  {user.providerData.map(provider => (
                    <li key={provider.providerId} className="text-sm text-gray-600">
                      {provider.providerId.replace('.com', '')}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 mb-6">
                <LoadingButton
                  onClick={() => handleLinkProvider(googleProvider)}
                  disabled={isProviderLinked('google.com')}
                  variant="outline"
                  className="w-full"
                >
                  {isProviderLinked('google.com') ? 'Google Vinculado' : 'Vincular Google'}
                </LoadingButton>

                <LoadingButton
                  onClick={() => handleLinkProvider(facebookProvider)}
                  disabled={isProviderLinked('facebook.com')}
                  variant="outline"
                  className="w-full"
                >
                  {isProviderLinked('facebook.com') ? 'Facebook Vinculado' : 'Vincular Facebook'}
                </LoadingButton>
              </div>

              <LoadingButton
                onClick={handleSignOut}
                variant="destructive"
                className="w-full"
              >
                Cerrar Sesión
              </LoadingButton>

              {message && (
                <MessageDisplay
                  message={message}
                  type={message.includes('Error') ? 'error' : 'success'}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <PostsManager user={user} />
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <PhotoUploadManager user={user} />
        </TabsContent>
      </Tabs>
    </ProfilePageTemplate>
  );
}
