import { LucideIcon } from "lucide-react";

interface PreferenceToggleProps {
  icon: LucideIcon;
  title: string;
  description: string;
  defaultChecked?: boolean;
}

export function PreferenceToggle({
  icon: Icon,
  title,
  description,
  defaultChecked = false,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-sm border border-border/60 bg-background">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="text-sm font-medium mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );
}
