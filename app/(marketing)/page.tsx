import { Hero } from "@/components/marketing/Hero";
import { HowWeWork } from "@/components/marketing/HowWeWork";
import { InquiryForm } from "@/components/marketing/InquiryForm";
import { WorkList } from "@/components/marketing/WorkList";

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <WorkList />
      <HowWeWork />
      <InquiryForm />
    </main>
  );
}
