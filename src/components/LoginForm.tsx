import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { ForgotPasswordDialog } from '@/components/ForgotPasswordDialog';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export function LoginForm() {
  const { login, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      clearError();
      
      await login(values.email, values.password);
      navigate('/compare');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <Card className="w-full border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-semibold text-foreground">Welcome back</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sign in to your Post Pulse AI account
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
                <AlertDescription>Invalid email or password. Please try again.</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Email address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        {...field}
                        className={`h-12 text-base rounded-lg border-2 transition-all duration-200 ${
                          form.formState.errors.email 
                            ? 'border-destructive focus-visible:ring-destructive' 
                            : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field}
                        className={`h-12 text-base rounded-lg border-2 transition-all duration-200 ${
                          form.formState.errors.password 
                            ? 'border-destructive focus-visible:ring-destructive' 
                            : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </Button>
              </div>
              
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
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 px-8 pt-0">
          
          <div className="text-sm text-muted-foreground text-center pt-2">
            New to Post Pulse AI?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary hover:text-primary/80 font-medium" 
              onClick={() => navigate('/signup')}
            >
              Create Account
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </PageTransition>
  );
}
