import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface ActivityStatsCardProps {
  title: string;
  stats: StatItem[];
}

export function ActivityStatsCard({ title, stats }: ActivityStatsCardProps) {
  return (
    <div className="bg-card rounded-sm border border-border/60 shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
