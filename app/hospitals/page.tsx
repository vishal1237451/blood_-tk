import { Header } from "@/frontend/components/header";
import { NearbyHospitalsMap } from "@/frontend/components/nearby-hospitals-map";

export default function HospitalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Nearby Hospitals
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find operational hospitals near your current location. We use your browser's location to find the closest medical centers.
          </p>
        </div>

        <section className="mt-6">
          <NearbyHospitalsMap />
        </section>
      </main>
    </div>
  );
}
