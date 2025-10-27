import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <nav aria-label="Progress" data-testid="progress-steps">
      <ol className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <li key={step.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "border-primary text-primary"
                      : "border-card-border text-muted-foreground"
                  }`}
                  data-testid={`step-indicator-${index}`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 mt-2 ${
                      isCompleted ? "bg-primary" : "bg-card-border"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pt-1">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
