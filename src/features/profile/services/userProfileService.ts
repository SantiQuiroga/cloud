import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile, UserProfileFormData } from '../types';
import { calculateAge } from '@/shared/utils';

export class UserProfileService {
  private static collectionName = 'users';

  static async createOrUpdateUserProfile(
    uid: string,
    email: string,
    displayName: string,
    profileData?: UserProfileFormData
  ): Promise<UserProfile> {
    const userRef = doc(db, this.collectionName, uid);

    let age: number | undefined;
    if (profileData?.birthDate) {
      age = calculateAge(profileData.birthDate);
    }

    const userData: Partial<UserProfile> = {
      uid,
      email,
      displayName,
      updatedAt: new Date(),
      ...(profileData && {
        address: profileData.address,
        birthDate: profileData.birthDate,
        age
      })
    };

    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    const updatedProfile = await this.getUserProfile(uid);
    if (!updatedProfile) {
      throw new Error('Error al obtener el perfil actualizado');
    }
    return updatedProfile;
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, this.collectionName, uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      address: data.address,
      birthDate: data.birthDate,
      age: data.age,
      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt),
      updatedAt: data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt)
    };
  }

  static async updateUserProfileData(uid: string, profileData: UserProfileFormData): Promise<UserProfile> {
    const userRef = doc(db, this.collectionName, uid);

    const age = calculateAge(profileData.birthDate);

    await updateDoc(userRef, {
      address: profileData.address,
      birthDate: profileData.birthDate,
      age,
      updatedAt: serverTimestamp()
    });

    const updatedProfile = await this.getUserProfile(uid);
    if (!updatedProfile) {
      throw new Error('Error al obtener el perfil actualizado');
    }
    return updatedProfile;
  }
}
