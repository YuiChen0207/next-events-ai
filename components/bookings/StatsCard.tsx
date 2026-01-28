interface StatsCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatsCard({ label, value, className = "" }: StatsCardProps) {
  return (
    <div className="bg-card border border-border/60 rounded-sm shadow-sm p-6">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className={`text-3xl font-bold ${className}`}>{value}</p>
    </div>
  );
}
