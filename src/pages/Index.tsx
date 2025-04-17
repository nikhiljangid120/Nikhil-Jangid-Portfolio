
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import TimelineSection from "@/components/TimelineSection";
import ContactSection from "@/components/ContactSection";
import { useEffect, useState } from "react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading (you could replace this with actual loading logic)
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-inkyblack flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-block relative w-20 h-20 mb-8">
            <div className="absolute w-full h-full border-4 border-t-lime border-r-teal border-b-orange border-l-purple rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-spaceGrotesk font-bold text-white">
            <span className="inline-block">N</span>
            <span className="inline-block animate-pulse text-lime">J</span>
          </h2>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <TimelineSection />
      <ContactSection />
    </Layout>
  );
};

export default Index;
