import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SiFacebook, SiGoogle } from "react-icons/si";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length === 0) return "";
  if (numbers.length <= 3) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  title: z.string().optional(),
  customTitle: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  customSuffix: z.string().optional(),
  alternateEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  alternatePhone: z.string().optional(),
  street: z.string().min(1, "Street address is required"),
  aptNumber: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

interface AccountCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountCreated?: (userId: string, email: string) => void;
  onSwitchToLogin?: () => void;
}

export default function AccountCreationDialog({ open, onOpenChange, onAccountCreated, onSwitchToLogin }: AccountCreationDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      title: "",
      customTitle: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      customSuffix: "",
      alternateEmail: "",
      primaryPhone: "",
      alternatePhone: "",
      street: "",
      aptNumber: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const titleValue = form.watch("title");
  const showCustomTitle = titleValue === "Other";

  const suffixValue = form.watch("suffix");
  const showCustomSuffix = suffixValue === "Other";

  const handleEmailSignup = async (data: SignupForm) => {
    setIsSubmitting(true);
    try {
      const displayName = `${data.firstName} ${data.lastName}`;
      const response = await apiRequest("POST", "/api/users", {
        email: data.email,
        password: data.password,
        authProvider: "email",
        title: data.title || null,
        customTitle: data.customTitle || null,
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.lastName,
        suffix: data.suffix || null,
        customSuffix: data.customSuffix || null,
        displayName,
        alternateEmail: data.alternateEmail || null,
        primaryPhone: data.primaryPhone,
        alternatePhone: data.alternatePhone || null,
        street: data.street,
        aptNumber: data.aptNumber || null,
        city: data.city,
        state: data.state,
        zip: data.zip,
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Your Account</DialogTitle>
          <DialogDescription>
            Complete your account information to save progress
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSignup)} className="space-y-6">
              {/* Login Credentials */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Login Credentials</h3>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login ID (Your Email is your Login ID) *</FormLabel>
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
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
                      <FormLabel>Confirm Password *</FormLabel>
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
              </div>

              {/* Name */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Name</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value || " "}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-title">
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value=" "> </SelectItem>
                            <SelectItem value="Mr.">Mr.</SelectItem>
                            <SelectItem value="Dr.">Dr.</SelectItem>
                            <SelectItem value="Ms.">Ms.</SelectItem>
                            <SelectItem value="Mrs.">Mrs.</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {showCustomTitle && (
                  <FormField
                    control={form.control}
                    name="customTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Col., Rev., Prof."
                            {...field}
                            data-testid="input-custom-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First *</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} data-testid="input-first-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle</FormLabel>
                      <FormControl>
                        <Input placeholder="Middle name (optional)" {...field} data-testid="input-middle-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last *</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} data-testid="input-last-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="suffix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suffix</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value !== "Other") {
                              form.setValue("customSuffix", "");
                            }
                          }} 
                          value={field.value || " "}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-suffix">
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value=" "> </SelectItem>
                            <SelectItem value="Jr.">Jr.</SelectItem>
                            <SelectItem value="Sr.">Sr.</SelectItem>
                            <SelectItem value="II">II</SelectItem>
                            <SelectItem value="III">III</SelectItem>
                            <SelectItem value="IV">IV</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {showCustomSuffix && (
                  <FormField
                    control={form.control}
                    name="customSuffix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Suffix</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., MD, Esq, Ret" 
                            {...field}
                            data-testid="input-custom-suffix" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Contact Information</h3>
                <FormField
                  control={form.control}
                  name="alternateEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="alternate@example.com (optional)" {...field} data-testid="input-alternate-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(123) 456-7890" 
                          {...field}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                          data-testid="input-primary-phone" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alternatePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(123) 456-7890 (optional)" 
                          {...field}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                          data-testid="input-alternate-phone" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Address</h3>
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} data-testid="input-street" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aptNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apt #</FormLabel>
                      <FormControl>
                        <Input placeholder="Apt/Suite # (optional)" {...field} data-testid="input-apt-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} data-testid="input-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} data-testid="input-state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP *</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} data-testid="input-zip" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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

          <div className="relative my-6">
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

          {onSwitchToLogin && (
            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Already have an account? </span>
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={onSwitchToLogin}
                data-testid="link-switch-to-login"
              >
                Log in instead
              </button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
