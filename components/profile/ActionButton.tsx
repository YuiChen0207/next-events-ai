import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
}

export function ActionButton({ icon: Icon, label }: ActionButtonProps) {
  return (
    <button className="w-full px-4 py-3 rounded-sm border border-border/60 hover:bg-muted transition-colors text-left flex items-center justify-between group">
      <span className="text-sm font-medium">{label}</span>
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </button>
  );
}
