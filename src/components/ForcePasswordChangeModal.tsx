// components/ForcePasswordChangeModal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/queries/useAuth';

// Schema for forced password change (no old password needed)
const forcedPasswordSchema = z
  .object({
    oldPassword: z.string().min(8, 'Old Password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type ForcedPasswordFormData = z.infer<typeof forcedPasswordSchema>;

interface ForcePasswordChangeModalProps {
  open: boolean;
  setOpen: (val:boolean) => void;
//   isChangePasswordLoading: boolean;
}

export function ForcePasswordChangeModal({
  open,
  setOpen,
//   isChangePasswordLoading,
}: ForcePasswordChangeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForcedPasswordFormData>({
    resolver: zodResolver(forcedPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const {refetchUser,changePasswordAsync,isChangePasswordLoading} = useAuth()

  const onSubmit = async (data: ForcedPasswordFormData) => {
    try {
      // The backend will ignore oldPassword when passwordResetRequired is true
      await changePasswordAsync({
        oldPassword: data.oldPassword, // dummy value, backend will bypass check
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },{onSuccess() {
        console.log('su✅')
        setOpen(false)
          reset();
          refetchUser?.()
          
      },});
      // Success → modal will close because user.passwordResetRequired becomes false
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <Dialog open={open}>
      {' '}
      {/* Non‑dismissible */}
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing on backdrop click
        onEscapeKeyDown={(e) => e.preventDefault()}      // Prevent Escape key
        aria-describedby="forced-password-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Set New Password</DialogTitle>
          <DialogDescription id="forced-password-description">
            Your password was reset by an administrator. You must choose a new
            password before continuing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input
              id="oldPassword"
              type="password"
              {...register('oldPassword')}
              className={errors.oldPassword ? 'border-red-500' : ''}
              disabled={isChangePasswordLoading}
              autoFocus
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              className={errors.newPassword ? 'border-red-500' : ''}
              disabled={isChangePasswordLoading}
              autoFocus
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-red-500' : ''}
              disabled={isChangePasswordLoading}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isChangePasswordLoading}
          >
            {isChangePasswordLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Set Password'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}