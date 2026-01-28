import { InfoIcon } from "./icons";

export function HelpInfoCard() {
  return (
    <div className="mt-6 bg-muted/30 border border-border/40 rounded-lg p-5">
      <div className="flex items-start gap-3">
        <InfoIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Need Help?</p>
          <p>
            Contact our support team if you have any questions about this event
            or booking process.
          </p>
        </div>
      </div>
    </div>
  );
}
