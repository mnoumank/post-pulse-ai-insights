
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PageTransition } from './PageTransition';
import { motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export function SignupForm() {
  const { register, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    clearError();
    
    try {
      await register(values.email, values.password, values.name);
      navigate('/compare');
    } catch (err) {
      // Error is handled by the auth context
      console.error('Signup failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldConfig = (fieldName: string) => {
    switch (fieldName) {
      case 'name':
        return {
          type: 'text',
          placeholder: 'Your name',
          label: 'Name'
        };
      case 'email':
        return {
          type: 'email',
          placeholder: 'your@email.com',
          label: 'Email'
        };
      case 'password':
        return {
          type: 'password',
          placeholder: '••••••••',
          label: 'Password'
        };
      case 'confirmPassword':
        return {
          type: 'password',
          placeholder: '••••••••',
          label: 'Confirm Password'
        };
      default:
        return {
          type: 'text',
          placeholder: '',
          label: fieldName
        };
    }
  };

  return (
    <PageTransition>
      <Card className="w-full border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-semibold text-foreground">Create your account</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Join Post Pulse AI and optimize your content
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="destructive" className="mb-6 border-destructive/20 bg-destructive/5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {['name', 'email', 'password', 'confirmPassword'].map((fieldName) => {
                const config = getFieldConfig(fieldName);
                return (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">{config.label}</FormLabel>
                        <FormControl>
                          <Input
                            type={config.type}
                            placeholder={config.placeholder}
                            {...field}
                            className={`h-12 text-base rounded-lg border-2 transition-all duration-200 ${
                              form.formState.errors[fieldName as keyof typeof form.formState.errors]
                                ? 'border-destructive focus-visible:ring-destructive'
                                : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
                            }`}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                );
              })}
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                    </motion.div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="px-8 pt-0">
          <div className="text-sm text-muted-foreground text-center w-full">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary hover:text-primary/80 font-medium" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </CardFooter>
      </Card>
    </PageTransition>
  );
}
