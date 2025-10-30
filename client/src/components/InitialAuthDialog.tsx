import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCircle, UserPlus, UserX } from "lucide-react";

interface InitialAuthDialogProps {
  open: boolean;
  onLoginClick: () => void;
  onCreateAccountClick: () => void;
  onContinueAsGuest: () => void;
}

export default function InitialAuthDialog({
  open,
  onLoginClick,
  onCreateAccountClick,
  onContinueAsGuest,
}: InitialAuthDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-center">
            Welcome to The Wedding Composer
          </DialogTitle>
          <DialogDescription className="text-center">
            Plan your perfect ceremony with our interactive planning tool
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            onClick={onLoginClick}
            variant="default"
            size="lg"
            className="w-full"
            data-testid="button-login"
          >
            <UserCircle className="h-5 w-5 mr-2" />
            Login to Continue
          </Button>

          <Button
            onClick={onCreateAccountClick}
            variant="default"
            size="lg"
            className="w-full bg-zinc-700 hover:bg-zinc-800 text-yellow-400 font-semibold border-0"
            data-testid="button-create-account"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Create Account
          </Button>

          <Button
            onClick={onContinueAsGuest}
            variant="outline"
            size="lg"
            className="w-full"
            data-testid="button-guest"
          >
            <UserX className="h-5 w-5 mr-2" />
            Continue as Guest
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Creating an account allows you to save your progress and return later
        </p>
      </DialogContent>
    </Dialog>
  );
}
