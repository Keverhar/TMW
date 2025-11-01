import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { User, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WeddingComposer as WeddingComposerType } from "@shared/schema";

export default function Account() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [composerId, setComposerId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasLoadedDataRef = useRef(false);
  const autosaveEnabled = useRef(false);
  
  const [userAccount] = useState<{ id: string; email: string } | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [contactInfo, setContactInfo] = useState({
    customerName: "",
    customerName2: "",
    customerEmail: "",
    customerPhone: "",
    smsConsent: false,
    mailingAddress: "",
  });

  const updateField = (field: string, value: string | boolean) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  // Load composer data
  useEffect(() => {
    const loadComposerData = async () => {
      if (userAccount && !hasLoadedDataRef.current) {
        hasLoadedDataRef.current = true;
        try {
          const response = await fetch(`/api/wedding-composers/by-user?userId=${userAccount.id}`);
          if (response.ok) {
            const composers: WeddingComposerType[] = await response.json();
            if (composers && composers.length > 0) {
              const composer = composers.sort((a, b) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )[0];
              
              setComposerId(composer.id);
              setContactInfo({
                customerName: composer.customerName || "",
                customerName2: composer.customerName2 || "",
                customerEmail: composer.customerEmail || "",
                customerPhone: composer.customerPhone || "",
                smsConsent: composer.smsConsent || false,
                mailingAddress: composer.mailingAddress || "",
              });
              
              // Enable autosave after loading data
              setTimeout(() => {
                autosaveEnabled.current = true;
              }, 1000);
            }
          }
        } catch (error) {
          console.error('Error loading composer data:', error);
          toast({
            title: "Error loading data",
            description: "Failed to load your contact information",
            variant: "destructive",
          });
        }
      }
    };
    
    loadComposerData();
  }, [userAccount, toast]);

  // Auto-save changes
  useEffect(() => {
    if (autosaveEnabled.current && userAccount && composerId) {
      const timeoutId = setTimeout(async () => {
        setIsSaving(true);
        try {
          await apiRequest("PATCH", `/api/wedding-composers/${composerId}`, contactInfo);
        } catch (error: any) {
          toast({
            title: "Error saving",
            description: error.message || "Failed to save your contact information",
            variant: "destructive",
          });
        } finally {
          setIsSaving(false);
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [contactInfo, composerId, userAccount, toast]);

  if (!userAccount) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>Please log in to view your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/composer")} data-testid="button-back-to-composer">
              Go to Composer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/composer")}
            data-testid="button-back-to-composer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Composer
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Account Information</h1>
          <p className="text-muted-foreground">
            Manage your contact details for your wedding booking
            {isSaving && <span className="ml-2 text-sm">(Saving...)</span>}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Contact Details</CardTitle>
            </div>
            <CardDescription>This information will be used for communication and confirmation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Couple's Names *</Label>
              <Input
                id="customer-name"
                data-testid="input-customer-name"
                placeholder="First person's name"
                value={contactInfo.customerName}
                onChange={(e) => updateField('customerName', e.target.value)}
                required
              />
              <Input
                id="customer-name-2"
                data-testid="input-customer-name-2"
                placeholder="Second person's name"
                value={contactInfo.customerName2}
                onChange={(e) => updateField('customerName2', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-email">Email Address *</Label>
              <Input
                id="customer-email"
                data-testid="input-customer-email"
                type="email"
                placeholder="your.email@example.com"
                value={contactInfo.customerEmail}
                onChange={(e) => updateField('customerEmail', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone Number (Optional)</Label>
              <Input
                id="customer-phone"
                data-testid="input-customer-phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={contactInfo.customerPhone}
                onChange={(e) => updateField('customerPhone', e.target.value)}
              />
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="sms-consent"
                  data-testid="checkbox-sms-consent"
                  checked={contactInfo.smsConsent}
                  onCheckedChange={(checked) => updateField('smsConsent', checked as boolean)}
                />
                <Label htmlFor="sms-consent" className="cursor-pointer text-sm">
                  Check here to allow SMS/Text Messages about your event. Carrier charges may apply.
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mailing-address">Mailing Address (for photo book delivery, if selected)</Label>
              <Textarea
                id="mailing-address"
                data-testid="input-mailing-address"
                placeholder="Street address, city, state, ZIP"
                value={contactInfo.mailingAddress}
                onChange={(e) => updateField('mailingAddress', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
