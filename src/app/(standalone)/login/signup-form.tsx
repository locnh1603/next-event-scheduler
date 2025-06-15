'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Input } from '@/components/shadcn-ui/input';
import { Button } from '@/components/shadcn-ui/button';
import { createClient } from '@/lib/supabase/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn-ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn-ui/popover';
import { Calendar } from '@/components/shadcn-ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ControllerRenderProps } from 'react-hook-form';
import { DateTimePicker } from '@/components/shadcn-ui/date-time-picker';

// Define the validation schema
const signupSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\d+$/, 'Phone number must contain only numbers'),
    address: z.string().optional(),
    dateOfBirth: z
      .date({
        required_error: 'Date of birth is required',
      })
      .refine(
        (date) => {
          // Check if user is at least 13 years old
          const today = new Date();
          const minAgeDate = new Date(
            today.getFullYear() - 13,
            today.getMonth(),
            today.getDate()
          );
          return date <= minAgeDate;
        },
        { message: 'You must be at least 13 years old' }
      ),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(4, 'Password must be at least 4 characters long')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /^[a-zA-Z0-9!@#$%^&*()_+=[\]{}|;:'",.<>?/`~\\-]*$/,
        'Password contains invalid characters'
      ),
    repeatPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const supabase = createClient();
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 13);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: defaultDate,
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const userData = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        address: data.address || '',
        birthDay: data.dateOfBirth.toISOString(),
      };

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: userData },
      });

      if (error) {
        setServerError(error.message);
      } else {
        form.reset();
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({
            field,
          }: {
            field: ControllerRenderProps<SignupFormData, 'fullName'>;
          }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-bold">
                Full Name*
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({
            field,
          }: {
            field: ControllerRenderProps<SignupFormData, 'phoneNumber'>;
          }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-bold">
                Phone Number*
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    // Allow only numeric input
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({
            field,
          }: {
            field: ControllerRenderProps<SignupFormData, 'address'>;
          }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-bold">
                Address
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({
            field,
          }: {
            field: ControllerRenderProps<SignupFormData, 'dateOfBirth'>;
          }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-gray-700 text-sm font-bold">
                Date of Birth*
              </FormLabel>
              <DateTimePicker
                value={field.value}
                granularity="day"
                displayFormat={{
                  hour24: 'PPP',
                  hour12: 'PP',
                }}
                onChange={field.onChange}
              ></DateTimePicker>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({
            field,
          }: {
            field: ControllerRenderProps<SignupFormData, 'email'>;
          }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-bold">
                Email*
              </FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({
            field,
          }: {
            field: ControllerRenderProps<SignupFormData, 'password'>;
          }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-bold">
                Password*
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <p className="text-gray-500 text-xs mt-1">
                Password must be at least 4 characters long and contain at least
                one letter and one number.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatPassword"
          render={({
            field,
          }: {
            field: ControllerRenderProps<SignupFormData, 'repeatPassword'>;
          }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-bold">
                Repeat Password*
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
            {serverError}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
