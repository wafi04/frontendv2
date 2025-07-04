'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { RegisterAuth } from '@/types/auth';
import { AuthPage } from '../component/AuthPage';
import { WhatsAppInput } from '@/components/custom/whatsappInput';
import { PasswordInput } from '@/components/custom/passwordInput';
import { useRegisterMutation } from '../component/server';


export default function RegisterPage() {
  const router = useRouter();
  const {mutate} =  useRegisterMutation()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      password: '',
      whatsapp: 62,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterAuth) => {
    setIsLoading(true);
    try {
        const req = mutate(data)
    } catch (error) {
      toast.error(' internal server error');
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  // Custom handler for WhatsApp input
  const handleWhatsAppChange = (value: string) => {
    setValue('whatsapp', value ? Number.parseInt(value) : 62);
  };

  return (
    <AuthPage>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <WhatsAppInput
              id="whatsapp"
              placeholder="8123456789"
              countryCode={62}
              value={watch('whatsapp')}
              onChange={(e) => handleWhatsAppChange(e.target.value)}
              error={errors.whatsapp?.message}
            />
          </div>
          <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              {...register('password')}
              showStrengthMeter
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Daftar'}
          </Button>
        </div>

        <div className="text-center text-sm">
          Sudah Punya Account?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
