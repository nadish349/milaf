import { Hero } from "@/components/Hero";
import { Page5Section } from "@/components/Page5Section";
import { Page6Section } from "@/components/Page6Section";
import { MilafColaPage1 } from "@/components/MilafColaPage1";
import { MilafColaPage2 } from "@/components/MilafColaPage2";
import { MilafColaPage3 } from "@/components/MilafColaPage3";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Page5Section />
      <Page6Section />
      <MilafColaPage1 />
      <MilafColaPage2 />
      <MilafColaPage3 />
      <Footer />
    </div>
  );
};

export default Index;
