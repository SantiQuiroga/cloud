'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserProfile, UserProfileFormData } from '../types';
import { UserProfileService } from '../services/userProfileService';

export const useUserProfile = (user: User | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const loadUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await UserProfileService.getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (err) {
        console.error('Error obteniendo perfil:', err);
        setError('Error al cargar el perfil');
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const updateProfileData = async (profileData: UserProfileFormData) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await UserProfileService.updateUserProfileData(user.uid, profileData);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError('Error al actualizar el perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: UserProfileFormData) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const newProfile = await UserProfileService.createOrUpdateUserProfile(
        user.uid,
        user.email || '',
        user.displayName || 'Usuario',
        profileData
      );
      setUserProfile(newProfile);
      return newProfile;
    } catch (err) {
      console.error('Error creando perfil:', err);
      setError('Error al crear el perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userProfile,
    loading,
    error,
    updateProfileData,
    createProfile
  };
};
