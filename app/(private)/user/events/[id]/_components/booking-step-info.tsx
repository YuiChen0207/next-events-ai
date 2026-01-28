import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderSummary } from "./order-summary";

interface TicketSelection {
  ticketTypeId: string;
  quantity: number;
  price: number;
  name: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
}

interface BookingStepInfoProps {
  formData: BookingFormData;
  selectedTickets: TicketSelection[];
  onFormChange: (data: Partial<BookingFormData>) => void;
  onBack: () => void;
  onContinue: () => void;
  isFormValid: boolean;
}

export function BookingStepInfo({
  formData,
  selectedTickets,
  onFormChange,
  onBack,
  onContinue,
  isFormValid,
}: BookingStepInfoProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => onFormChange({ email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => onFormChange({ phone: e.target.value })}
            required
          />
        </div>
      </div>

      <OrderSummary selectedTickets={selectedTickets} showDetails={true} />

      <div className="flex justify-between gap-2 pt-4">
        <Button
          type="button"
          className="cursor-pointer"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          className="cursor-pointer"
          onClick={onContinue}
          disabled={!isFormValid}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
