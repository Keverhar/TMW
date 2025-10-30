import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SiFacebook, SiGoogle } from "react-icons/si";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

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

interface AccountCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountCreated?: (userId: string, email: string) => void;
}

export default function AccountCreationDialog({ open, onOpenChange, onAccountCreated }: AccountCreationDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });

  const handleEmailSignup = async (data: SignupForm) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/users", {
        email: data.email,
        password: data.password,
        displayName: data.displayName || data.email.split("@")[0],
        authProvider: "email",
      });
      const user = await response.json();
      
      toast({
        title: "Account created successfully!",
        description: "Your progress has been saved.",
      });

      if (onAccountCreated) {
        onAccountCreated(user.id, data.email);
      }

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignup = async (provider: "google" | "facebook") => {
    toast({
      title: `${provider === "google" ? "Google" : "Facebook"} Sign-In`,
      description: `${provider === "google" ? "Google" : "Facebook"} OAuth integration will be added soon. For now, please use email signup.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Your Account</DialogTitle>
          <DialogDescription>
            Save your progress and continue later
          </DialogDescription>
        </DialogHeader>

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
              className="w-full bg-zinc-700 hover:bg-zinc-800 text-yellow-400 font-semibold border-0" 
              disabled={isSubmitting}
              data-testid="button-create-account"
            >
              {isSubmitting ? (
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
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignup("google")}
            disabled={isSubmitting}
            data-testid="button-google-oauth"
          >
            <SiGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignup("facebook")}
            disabled={isSubmitting}
            data-testid="button-facebook-oauth"
          >
            <SiFacebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
