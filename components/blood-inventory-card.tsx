import { Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BloodInventoryCardProps {
  bloodType: string;
  units: number;
  lastUpdated: string;
}

function getStockLevel(units: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (units <= 5) {
    return {
      label: "Critical",
      color: "text-red-700",
      bgColor: "bg-red-100",
    };
  }
  if (units <= 15) {
    return {
      label: "Low",
      color: "text-amber-700",
      bgColor: "bg-amber-100",
    };
  }
  return {
    label: "Adequate",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  };
}

export function BloodInventoryCard({
  bloodType,
  units,
  lastUpdated,
}: BloodInventoryCardProps) {
  const stockLevel = getStockLevel(units);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Droplet className="h-5 w-5 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              {bloodType}
            </span>
          </CardTitle>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${stockLevel.bgColor} ${stockLevel.color}`}
          >
            {stockLevel.label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <p className="text-4xl font-bold text-foreground">{units}</p>
          <p className="text-sm text-muted-foreground">units available</p>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Last updated: {new Date(lastUpdated).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
