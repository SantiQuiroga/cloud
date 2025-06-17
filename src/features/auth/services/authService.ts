import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  linkWithPopup,
  AuthProvider,
  User
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import {
  auth,
  googleProvider,
  facebookProvider
} from '@/lib/firebase';
import { getFirebaseErrorMessage } from '@/shared/utils';

export class AuthService {
  static async signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw new Error(getFirebaseErrorMessage(firebaseError.code));
    }
  }

  static async signUpWithEmail(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw new Error(getFirebaseErrorMessage(firebaseError.code));
    }
  }

  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw new Error(getFirebaseErrorMessage(firebaseError.code));
    }
  }

  static async signInWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      return result.user;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/account-exists-with-different-credential') {
        throw new Error('Esta cuenta ya existe con un proveedor diferente');
      }
      throw new Error(getFirebaseErrorMessage(firebaseError.code));
    }
  }

  static async linkProvider(provider: AuthProvider) {
    try {
      if (!auth.currentUser) {
        throw new Error('Usuario no autenticado');
      }
      const result = await linkWithPopup(auth.currentUser, provider);
      return result.user;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw new Error(getFirebaseErrorMessage(firebaseError.code));
    }
  }

  static async signOut() {
    try {
      await auth.signOut();
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw new Error(getFirebaseErrorMessage(firebaseError.code));
    }
  }

  static isProviderLinked(user: User, providerId: string): boolean {
    return user?.providerData?.some((provider) => provider.providerId === providerId) || false;
  }
}
