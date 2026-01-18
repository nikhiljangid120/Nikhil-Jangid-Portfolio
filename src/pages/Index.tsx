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
import { TooltipProvider } from "@/components/ui/tooltip";
import TerminalBlock from "@/components/TerminalBlock";
import CustomCursor from "@/components/CustomCursor";
import CommandPalette from "@/components/CommandPalette";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <AnimatePresence>
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
            <ResumeSection />
            <TimelineSection />
            <ContactSection />
          </Layout>
        </TooltipProvider>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;