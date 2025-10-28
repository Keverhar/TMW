import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SiFacebook, SiGoogle } from "react-icons/si";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  displayName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function AccountCreation() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/account-creation/:composerId");
  const { toast } = useToast();
  const [showWarning, setShowWarning] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const composerId = params?.composerId;

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!accountCreated) {
        e.preventDefault();
        e.returnValue = "If you leave without creating an account your selections will not be saved and you'll have to start over";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [accountCreated]);

  const handleBackNavigation = () => {
    if (!accountCreated) {
      setShowWarning(true);
    } else {
      setLocation("/composer");
    }
  };

  const handleEmailSignup = async (data: SignupForm) => {
    try {
      const response = await apiRequest("POST", "/api/users", {
        email: data.email,
        password: data.password,
        displayName: data.displayName || data.email.split("@")[0],
        authProvider: "email",
      });
      const user = await response.json();
      
      setUserId(user.id);
      setAccountCreated(true);
      
      toast({
        title: "Account created successfully!",
        description: "You can now proceed with payment.",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOAuthSignup = async (provider: "google" | "facebook") => {
    toast({
      title: `${provider === "google" ? "Google" : "Facebook"} Sign-In`,
      description: `${provider === "google" ? "Google" : "Facebook"} OAuth integration will be added soon. For now, please use email signup.`,
    });
  };

  const handlePayment = async (method: "stripe" | "affirm") => {
    if (!composerId) {
      toast({
        title: "Error",
        description: "No booking found. Please start over.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentComplete(true);
      setIsProcessingPayment(false);
      
      toast({
        title: "Payment Processing",
        description: `${method === "stripe" ? "Stripe" : "Affirm"} payment integration will be added soon.`,
      });

      setTimeout(() => {
        setLocation(`/confirmation/${composerId}`);
      }, 2000);
    } catch (error: any) {
      setIsProcessingPayment(false);
      toast({
        title: "Payment error",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Payment Successful!</CardTitle>
            <CardDescription>Redirecting to confirmation page...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (accountCreated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold mb-2">Complete Your Booking</h1>
            <p className="text-muted-foreground">Choose your payment method</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover-elevate cursor-pointer" onClick={() => !isProcessingPayment && handlePayment("stripe")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pay with Stripe
                </CardTitle>
                <CardDescription>
                  Credit card, debit card, or digital wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  disabled={isProcessingPayment}
                  data-testid="button-stripe-payment"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue with Stripe"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate cursor-pointer" onClick={() => !isProcessingPayment && handlePayment("affirm")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pay with Affirm
                </CardTitle>
                <CardDescription>
                  Buy now, pay over time with monthly payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  disabled={isProcessingPayment}
                  data-testid="button-affirm-payment"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue with Affirm"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Account created as: <span className="font-medium">{form.getValues("email")}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Required before completing your booking</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign up with email</CardTitle>
            <CardDescription>Create a new account to save your wedding details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEmailSignup)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="you@example.com" 
                          {...field} 
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="Your name" 
                          {...field} 
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="At least 8 characters" 
                          {...field} 
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Re-enter password" 
                          {...field} 
                          data-testid="input-confirm-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={form.formState.isSubmitting}
                  data-testid="button-create-account"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignup("google")}
                disabled={form.formState.isSubmitting}
                data-testid="button-google-oauth"
              >
                <SiGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuthSignup("facebook")}
                disabled={form.formState.isSubmitting}
                data-testid="button-facebook-oauth"
              >
                <SiFacebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleBackNavigation}
                data-testid="button-back"
              >
                Back to booking
              </Button>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                If you leave without creating an account your selections will not be saved and you'll have to start over.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-warning">Stay on page</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => setLocation("/composer")}
                data-testid="button-confirm-leave"
              >
                Leave anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
