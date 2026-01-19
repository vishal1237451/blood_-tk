import { Header } from "@/components/header";
import { BloodTestRequestForm } from "@/components/blood-test-request-form";
import { TestTube, Clock, FileText, Phone } from "lucide-react";

export default function RequestTestPage() {
  const steps = [
    {
      icon: FileText,
      title: "Fill the Form",
      description: "Complete the blood test request form with your details",
    },
    {
      icon: Phone,
      title: "Confirmation Call",
      description: "We will call you to confirm your appointment",
    },
    {
      icon: Clock,
      title: "Visit Us",
      description: "Come to our facility at your scheduled time",
    },
    {
      icon: TestTube,
      title: "Get Results",
      description: "Receive your test results within 24-48 hours",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Request a Blood Test
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Schedule your blood test appointment with us. We offer a variety of
            tests with quick and accurate results.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="mb-6 text-center text-lg font-semibold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center rounded-lg border border-border bg-card p-6 text-center"
              >
                <div className="absolute -top-3 left-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <BloodTestRequestForm />
      </main>
    </div>
  );
}
