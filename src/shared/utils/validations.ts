import * as z from 'zod';
import { VALIDATION_MESSAGES } from '@/shared/constants';

export const emailSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.REQUIRED_FIELD)
  .email(VALIDATION_MESSAGES.INVALID_EMAIL);

export const passwordSchema = z
  .string()
  .min(6, VALIDATION_MESSAGES.MIN_LENGTH(6));

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const userProfileSchema = z.object({
  address: z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD),
  birthDate: z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD),
});

export const postSchema = z.object({
  title: z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD).max(100, VALIDATION_MESSAGES.MAX_LENGTH(100)),
  content: z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD).max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000)),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type PostFormData = z.infer<typeof postSchema>;
