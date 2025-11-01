import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

const accountSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  confirmPassword: z.string().optional(),
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  alternateEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  alternatePhone: z.string().optional(),
  street: z.string().min(1, "Street address is required"),
  aptNumber: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AccountForm = z.infer<typeof accountSchema>;

export default function Account() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showOtherTitle, setShowOtherTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const form = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
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

  useEffect(() => {
    const loadAccountData = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        setLocation("/composer");
        return;
      }

      const user = JSON.parse(savedUser);
      setUserEmail(user.email);

      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (response.ok) {
          const userData = await response.json();
          form.reset({
            password: "",
            confirmPassword: "",
            title: userData.title || "",
            firstName: userData.firstName || "",
            middleName: userData.middleName || "",
            lastName: userData.lastName || "",
            suffix: userData.suffix || "",
            alternateEmail: userData.alternateEmail || "",
            primaryPhone: userData.primaryPhone || "",
            alternatePhone: userData.alternatePhone || "",
            street: userData.street || "",
            aptNumber: userData.aptNumber || "",
            city: userData.city || "",
            state: userData.state || "",
            zip: userData.zip || "",
          });
        }
      } catch (error) {
        console.error("Error loading account data:", error);
        toast({
          title: "Error",
          description: "Failed to load account information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountData();
  }, [form, setLocation, toast]);

  const handleSave = async (data: AccountForm) => {
    setIsSaving(true);
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        throw new Error("Not logged in");
      }

      const user = JSON.parse(savedUser);
      const updateData: any = {
        title: data.title || null,
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.lastName,
        suffix: data.suffix || null,
        displayName: `${data.firstName} ${data.lastName}`,
        alternateEmail: data.alternateEmail || null,
        primaryPhone: data.primaryPhone,
        alternatePhone: data.alternatePhone || null,
        street: data.street,
        aptNumber: data.aptNumber || null,
        city: data.city,
        state: data.state,
        zip: data.zip,
      };

      // Only include password if it was changed
      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }

      await apiRequest("PATCH", `/api/users/${user.id}`, updateData);

      toast({
        title: "Success",
        description: "Your account information has been updated",
      });

      // Clear password fields after successful save
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update account information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/composer")}
            data-testid="button-back-to-composer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Composer
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            {/* Login Information */}
            <Card>
              <CardHeader>
                <CardTitle>Login Credentials</CardTitle>
                <CardDescription>Your login email cannot be changed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Login ID (Your Email is your Login ID)</label>
                  <Input
                    value={userEmail}
                    disabled
                    className="bg-muted"
                    data-testid="input-login-email"
                  />
                  <p className="text-xs text-muted-foreground">Your email address is your login ID and cannot be changed</p>
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Leave blank to keep current password"
                          {...field}
                          data-testid="input-new-password"
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
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          {...field}
                          data-testid="input-confirm-new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Name */}
            <Card>
              <CardHeader>
                <CardTitle>Name</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            if (value === "Other") {
                              setShowOtherTitle(true);
                              field.onChange(customTitle || "Other");
                            } else {
                              setShowOtherTitle(false);
                              setCustomTitle("");
                              field.onChange(value);
                            }
                          }} 
                          value={showOtherTitle ? "Other" : (field.value || " ")}
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
                        {showOtherTitle && (
                          <Input
                            placeholder="Enter custom title (e.g., Col., Rev.)"
                            value={customTitle}
                            onChange={(e) => {
                              setCustomTitle(e.target.value);
                              field.onChange(e.target.value);
                            }}
                            className="mt-2"
                            data-testid="input-custom-title"
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                        <Select onValueChange={field.onChange} value={field.value || " "}>
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
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How we can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                        <Input placeholder="(123) 456-7890" {...field} data-testid="input-primary-phone" />
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
                        <Input placeholder="(123) 456-7890 (optional)" {...field} data-testid="input-alternate-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Your billing and mailing address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                data-testid="button-save-account"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
