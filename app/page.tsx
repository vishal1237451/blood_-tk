import { Header } from "@/components/header";
import { BloodInventoryCard } from "@/components/blood-inventory-card";
import { DashboardStats } from "@/components/dashboard-stats";
import { getBloodInventory, getDashboardStats } from "@/app/actions";
import { Droplet, Heart, Users } from "lucide-react";

export default async function DashboardPage() {
  const [inventory, stats] = await Promise.all([
    getBloodInventory(),
    getDashboardStats(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Blood Bank Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Monitor blood inventory levels and manage donor applications
          </p>
        </div>

        <DashboardStats
          totalUnits={stats.totalUnits}
          totalDonors={stats.totalDonors}
          pendingTests={stats.pendingTests}
          criticalTypes={stats.criticalTypes}
        />

        <section className="mt-10">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            Blood Inventory
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {inventory.map((item) => (
              <BloodInventoryCard
                key={item.id}
                bloodType={item.blood_type}
                units={item.units_available}
                lastUpdated={item.last_updated}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            Quick Actions
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <a
              href="/donate"
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Donate Blood
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Register as a blood donor and help save lives
              </p>
            </a>
            <a
              href="/request-test"
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Droplet className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Request Blood Test
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Schedule a blood test appointment
              </p>
            </a>
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Users className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Community Impact
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Join thousands of donors making a difference
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
