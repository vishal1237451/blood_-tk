import { Header } from "@/components/header";
import { DonorApplicationForm } from "@/components/donor-application-form";
import { Heart, Clock, CheckCircle, Shield } from "lucide-react";

export default function DonatePage() {
  const benefits = [
    {
      icon: Heart,
      title: "Save Lives",
      description: "One donation can save up to three lives",
    },
    {
      icon: Clock,
      title: "Quick Process",
      description: "The entire process takes about 30-45 minutes",
    },
    {
      icon: CheckCircle,
      title: "Free Health Check",
      description: "Get a mini health screening with each donation",
    },
    {
      icon: Shield,
      title: "Safe & Sterile",
      description: "All equipment is sterile and used only once",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Become a Blood Donor
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Your blood donation can make a life-saving difference. Register today
            and join our community of heroes.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex flex-col items-center rounded-lg border border-border bg-card p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <DonorApplicationForm />
      </main>
    </div>
  );
}
