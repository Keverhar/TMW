import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Edit,
  FileText,
  CreditCard,
  ArrowRight,
  Home as HomeIcon,
  Heart
} from "lucide-react";
import type { WeddingComposer } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  // Get user from localStorage (set during login/account creation)
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const { data: composers, isLoading } = useQuery<WeddingComposer[]>({
    queryKey: ["/api/wedding-composers/by-user", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/wedding-composers/by-user?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch composers");
      return response.json();
    },
    enabled: !!user?.id,
  });

  const latestComposer = composers && composers.length > 0 
    ? composers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  const calculateCompletionPercentage = (composer: WeddingComposer | null) => {
    if (!composer) return 0;
    
    const blocks = [
      { name: "Event Type", complete: !!composer.eventType },
      { name: "Date & Time", complete: !!composer.preferredDate && !!composer.timeSlot },
      { name: "Signature Color", complete: !!composer.signatureColor },
      { name: "Music", complete: composer.musicCompletionStatus === "done" },
      { name: "Announcements", complete: composer.announcementsCompletionStatus === "done" },
      { name: "Ceremony", complete: !!composer.ceremonyScript },
      { name: "Processional", complete: composer.processionalCompletionStatus === "done" },
      { name: "Reception", complete: composer.receptionCompletionStatus === "done" },
      { name: "Photography", complete: composer.photographyCompletionStatus === "done" },
      { name: "Memory Wall", complete: composer.slideshowCompletionStatus === "done" },
      { name: "Personal Touches", complete: composer.personalTouchesCompletionStatus === "done" },
      { name: "Contact Info", complete: !!composer.customerName && !!composer.customerEmail },
    ];

    const completedCount = blocks.filter(b => b.complete).length;
    return Math.round((completedCount / blocks.length) * 100);
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels: Record<string, string> = {
      "modest-wedding": "Modest Wedding",
      "modest-elopement": "Elopement",
      "vow-renewal": "Vow Renewal",
      "other": "Other Event"
    };
    return labels[eventType] || eventType;
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getPaymentStatus = (composer: WeddingComposer) => {
    if (composer.paymentStatus === "paid") {
      return { label: "Paid", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: CheckCircle2 };
    } else if (composer.paymentStatus === "pending") {
      return { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: Clock };
    } else {
      return { label: "Unpaid", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <CardTitle>Loading Dashboard...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!latestComposer) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto py-12">
          <Card>
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="font-serif text-3xl">Start Planning Your Wedding</CardTitle>
              <CardDescription>Create your perfect celebration with the Wedding Composer</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button 
                onClick={() => setLocation("/composer")} 
                size="lg"
                data-testid="button-start-planning"
              >
                Begin Planning
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/")}
                data-testid="button-home"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateCompletionPercentage(latestComposer);
  const paymentStatus = getPaymentStatus(latestComposer);
  const PaymentIcon = paymentStatus.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif mb-1">Wedding Dashboard</h1>
              <p className="text-muted-foreground">Manage your celebration details</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/")}
              data-testid="button-home"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8 space-y-6">
        {/* Event Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-serif text-2xl mb-1">
                  {latestComposer.customerName ? `${latestComposer.customerName}'s Wedding` : "Your Wedding"}
                </CardTitle>
                <CardDescription>
                  {getEventTypeLabel(latestComposer.eventType)}
                </CardDescription>
              </div>
              <Button 
                onClick={() => setLocation("/composer")}
                data-testid="button-edit-details"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Wedding Date</p>
                  <p className="text-sm text-muted-foreground">
                    {latestComposer.preferredDate || "Not selected yet"}
                  </p>
                  {latestComposer.backupDate && (
                    <p className="text-sm text-muted-foreground">
                      Backup: {latestComposer.backupDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {latestComposer.timeSlot || "Not selected yet"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Total Investment</p>
                  <p className="text-sm text-muted-foreground">
                    {latestComposer.totalPrice ? formatPrice(latestComposer.totalPrice) : "TBD"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PaymentIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Payment Status</p>
                  <Badge className={`${paymentStatus.color} mt-1`} data-testid="badge-payment-status">
                    {paymentStatus.label}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Planning Progress</p>
                <span className="text-sm font-medium" data-testid="text-progress-percentage">
                  {completionPercentage}% Complete
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" data-testid="progress-completion" />
            </div>
          </CardContent>
        </Card>

        {/* Completion Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Planning Checklist</CardTitle>
            <CardDescription>Track your wedding planning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: "Event Type & Date", complete: !!latestComposer.eventType && !!latestComposer.preferredDate },
                { name: "Signature Color", complete: !!latestComposer.signatureColor },
                { name: "Music Selection", complete: latestComposer.musicCompletionStatus === "done" },
                { name: "Announcements", complete: latestComposer.announcementsCompletionStatus === "done" },
                { name: "Ceremony Script", complete: !!latestComposer.ceremonyScript },
                { name: "Processional Details", complete: latestComposer.processionalCompletionStatus === "done" },
                { name: "Reception Planning", complete: latestComposer.receptionCompletionStatus === "done" },
                { name: "Photography Preferences", complete: latestComposer.photographyCompletionStatus === "done" },
                { name: "Memory Wall", complete: latestComposer.slideshowCompletionStatus === "done" },
                { name: "Personal Touches", complete: latestComposer.personalTouchesCompletionStatus === "done" },
                { name: "Contact Information", complete: !!latestComposer.customerName && !!latestComposer.customerEmail },
                { name: "Payment", complete: latestComposer.paymentStatus === "paid" },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-2 rounded-md hover-elevate"
                  data-testid={`checklist-item-${index}`}
                >
                  {item.complete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={item.complete ? "text-sm" : "text-sm text-muted-foreground"}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your wedding booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => setLocation("/composer")} 
              className="w-full justify-between"
              variant="outline"
              data-testid="button-continue-planning"
            >
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Continue Planning
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            {latestComposer.paymentStatus !== "paid" && (
              <Button 
                onClick={() => setLocation(`/payment/${latestComposer.id}`)} 
                className="w-full justify-between"
                data-testid="button-complete-payment"
              >
                <span className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Payment
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            {latestComposer.paymentStatus === "paid" && (
              <Button 
                onClick={() => setLocation(`/confirmation/${latestComposer.id}`)} 
                className="w-full justify-between"
                variant="outline"
                data-testid="button-view-confirmation"
              >
                <span className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  View Confirmation
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Additional Details */}
        {latestComposer.ceremonySpecialRequests && (
          <Card>
            <CardHeader>
              <CardTitle>Special Ceremony Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{latestComposer.ceremonySpecialRequests}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
