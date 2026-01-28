import { LucideIcon } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  subtitle: string;
  badge?: { icon: LucideIcon; label: string };
  details: { icon: LucideIcon; text: string }[];
  avatarPlaceholder: React.ReactNode;
}

export function ProfileHeader({
  name,
  subtitle,
  badge,
  details,
  avatarPlaceholder,
}: ProfileHeaderProps) {
  return (
    <div className="bg-card rounded-sm border border-border/60 shadow-sm overflow-hidden">
      <div className="relative h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center">
            {avatarPlaceholder}
          </div>
        </div>
      </div>

      <div className="pt-14 px-6 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-semibold">{name}</h2>
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <badge.icon className="w-3 h-3" />
              {badge.label}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>

        <div className="space-y-3">
          {details.map((detail, index) => {
            const DetailIcon = detail.icon;
            return (
              <div key={index} className="flex items-center gap-3 text-sm">
                <DetailIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{detail.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
