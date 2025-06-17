export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  address?: string;
  birthDate?: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileFormData {
  address: string;
  birthDate: string;
}
