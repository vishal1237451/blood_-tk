import { Users, TestTube, Droplets, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  totalUnits: number;
  totalDonors: number;
  pendingTests: number;
  criticalTypes: number;
}

export function DashboardStats({
  totalUnits,
  totalDonors,
  pendingTests,
  criticalTypes,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Blood Units",
      value: totalUnits,
      icon: Droplets,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Donor Applications",
      value: totalDonors,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Pending Tests",
      value: pendingTests,
      icon: TestTube,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
    },
    {
      label: "Critical Stock",
      value: criticalTypes,
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
