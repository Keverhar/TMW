import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ArrowLeft, Menu, FileText, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WeddingComposer as WeddingComposerType } from "@shared/schema";
import { PACKAGES, CEREMONY_SCRIPTS, VOWS, MUSIC, THEME_COLORS, CAKE_TOPPERS } from "@shared/pricing";

type AccountView = "contact" | "summary";

export default function Account() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<AccountView>("contact");
  const [composerId, setComposerId] = useState<string | null>(null);
  const [composerData, setComposerData] = useState<WeddingComposerType | null>(null);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    setLocation("/composer");
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
              setComposerData(composer);
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
            description: "Failed to load your information",
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
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setLocation("/composer")}
            data-testid="button-back-to-composer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Composer
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" data-testid="button-account-menu">
                <Menu className="mr-2 h-4 w-4" />
                Account Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setCurrentView("contact")}
                data-testid="menu-item-contact"
              >
                <User className="mr-2 h-4 w-4" />
                Contact Info
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setCurrentView("summary")}
                data-testid="menu-item-summary"
              >
                <FileText className="mr-2 h-4 w-4" />
                Summary
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                data-testid="menu-item-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {currentView === "contact" ? (
          <>
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Contact Information</h1>
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
          </>
        ) : (
          <SummaryView composerData={composerData} />
        )}
      </div>
    </div>
  );
}

function SummaryView({ composerData }: { composerData: WeddingComposerType | null }) {
  if (!composerData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Wedding Details Yet</CardTitle>
          <CardDescription>Start composing your wedding to see a summary here</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const packageInfo = PACKAGES.find(p => p.id === composerData.eventType);
  const ceremonyScript = CEREMONY_SCRIPTS.find(s => s.id === composerData.ceremonyScript);
  const vows = VOWS.find(v => v.id === composerData.vows);
  const music = MUSIC.find(m => m.id === composerData.music);
  const themeColor = THEME_COLORS.find(c => c.id === composerData.themeColor);
  const cakeTopper = CAKE_TOPPERS.find(t => t.id === composerData.cakeTopper);

  const formatSelection = (block: any) => {
    if (!block || block.selection === "default") return null;
    return block.selection;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Wedding Summary</h1>
        <p className="text-muted-foreground">
          A comprehensive overview of all your wedding selections
        </p>
      </div>

      {/* Event Package */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">1.</span> Event Package
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="font-semibold">{packageInfo?.name || "Not selected"}</p>
              {packageInfo && <p className="text-sm text-muted-foreground">{packageInfo.description}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">2.</span> Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-semibold">{composerData.eventDate || "Not selected"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-semibold">{composerData.eventTime || "Not selected"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ceremony Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">3.</span> Ceremony Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Ceremony Script</p>
            <p className="font-semibold">{ceremonyScript?.name || "Not selected"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Vows</p>
            <p className="font-semibold">{vows?.name || "Not selected"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Music</p>
            <p className="font-semibold">{music?.name || "Not selected"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Theme Color</p>
            <p className="font-semibold">{themeColor?.name || "Not selected"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cake Topper</p>
            <p className="font-semibold">{cakeTopper?.name || "Not selected"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Composer Blocks */}
      {[...Array(12)].map((_, i) => {
        const blockNum = i + 1;
        const blockKey = `block${blockNum}` as keyof WeddingComposerType;
        const block = composerData[blockKey];
        
        if (!block || typeof block !== 'object') return null;
        
        const selection = formatSelection(block);
        if (!selection) return null;

        return (
          <Card key={blockNum}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-primary">{blockNum + 3}.</span> Block {blockNum}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{selection}</p>
            </CardContent>
          </Card>
        );
      })}

      {/* Add-ons */}
      {composerData.addOns && composerData.addOns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Add-ons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {composerData.addOns.map((addon, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>{addon}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Payment Information */}
      {composerData.selectedPaymentMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-semibold">{composerData.selectedPaymentMethod}</p>
            </div>
            {composerData.termsAccepted && (
              <div>
                <p className="text-sm text-muted-foreground">Terms Accepted</p>
                <p className="font-semibold">Yes</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
