import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
}

interface SystemStatsGridProps {
  stats: StatItem[];
}

export function SystemStatsGrid({ stats }: SystemStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-background rounded-sm border border-border/60 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-green-600 font-medium">
                {stat.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
