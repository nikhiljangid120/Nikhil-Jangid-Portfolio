import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import TimelineSection from "@/components/TimelineSection";
import ContactSection from "@/components/ContactSection";
import ResumeSection from "@/components/ResumeSection";
import BadgesCertificates from "@/components/BadgesCertificates";
import { TooltipProvider } from "@/components/ui/tooltip";
import TerminalBlock from "@/components/TerminalBlock";
import CustomCursor from "@/components/CustomCursor";
import CommandPalette from "@/components/CommandPalette";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const bootSequence = [
    { text: "initializing_system_core...", delay: 200, color: "text-blue-400" },
    { text: "loading_modules: [react, framer-motion, three.js]", delay: 150 },
    { text: "verifying_integrity... OK", delay: 100, color: "text-green-400" },
    { text: "establishing_secure_connection...", delay: 300, isCommand: true },
    { text: "fetching_user_profile: 'Nikhil Jangid'", delay: 200, color: "text-yellow-400" },
    { text: "optimizing_assets...", delay: 200 },
    { text: "starting_dev_environment...", delay: 400, color: "text-primary" },
    { text: "ACCESS_GRANTED", delay: 200, color: "text-green-500 font-bold" },
  ];

  const handleBootComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <TerminalBlock
            lines={bootSequence}
            onComplete={handleBootComplete}
            title="portfolio_boot_loader"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent"
        >
          <TooltipProvider>
            <CustomCursor />
            <ScrollProgress />
            <CommandPalette />
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-20 -z-10" />
            <Layout>
              <HeroSection />
              <AboutSection />
              <SkillsSection />
              <ProjectsSection />
              <BadgesCertificates />
              <ResumeSection />
              <TimelineSection />
              <ContactSection />
            </Layout>
          </TooltipProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
