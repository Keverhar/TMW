import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface Script {
  id: string;
  name: string;
  description: string;
  preview: string;
}

interface CeremonyScriptSelectorProps {
  scripts: Script[];
  selectedScript?: string;
  onSelectScript: (scriptId: string) => void;
}

export default function CeremonyScriptSelector({
  scripts,
  selectedScript,
  onSelectScript,
}: CeremonyScriptSelectorProps) {
  const [previewScript, setPreviewScript] = useState<Script | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Ceremony Script</CardTitle>
        <CardDescription>Choose the style of ceremony that resonates with you</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedScript} onValueChange={onSelectScript}>
          <div className="space-y-3">
            {scripts.map((script) => (
              <div
                key={script.id}
                className="flex items-center justify-between space-x-2 rounded-md border p-4 hover-elevate"
                data-testid={`row-script-${script.id}`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <RadioGroupItem
                    value={script.id}
                    id={script.id}
                    data-testid={`radio-script-${script.id}`}
                  />
                  <div className="flex-1">
                    <Label htmlFor={script.id} className="text-base font-medium cursor-pointer">
                      {script.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{script.description}</p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewScript(script)}
                      data-testid={`button-preview-${script.id}`}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">{script.name}</DialogTitle>
                      <DialogDescription>{script.description}</DialogDescription>
                    </DialogHeader>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line text-foreground">{script.preview}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
