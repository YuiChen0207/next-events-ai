import { LucideIcon } from "lucide-react";

interface Action {
  label: string;
  icon: LucideIcon;
}

interface QuickActionsCardProps {
  title: string;
  actions: Action[];
}

export function QuickActionsCard({ title, actions }: QuickActionsCardProps) {
  return (
    <div className="bg-card rounded-sm border border-border/60 shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="w-full px-4 py-3 rounded-sm border border-border/60 hover:bg-muted transition-colors text-left flex items-center gap-3"
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
