type BookingStep = "select" | "info" | "confirm";

interface BookingStepperProps {
  currentStep: BookingStep;
}

const steps = [
  { id: "select", label: "Select Tickets", number: 1 },
  { id: "info", label: "Your Info", number: 2 },
  { id: "confirm", label: "Confirm", number: 3 },
] as const;

import { Fragment } from "react";

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center gap-2 py-4">
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          {index > 0 && <div className="h-px bg-border flex-1" />}
          <div className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.number}
            </div>
            <div className="text-sm font-medium">{step.label}</div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
