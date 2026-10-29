import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ExperienceSection from './sections/ExperienceSection';
import ToolsSection from './sections/ToolsSection';
import GlobalMotionTexture from './components/GlobalMotionTexture';
import { ContactMenuProvider } from './components/ContactMenu';

export function App() {
  return (
    <ContactMenuProvider>
      <main className="relative w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-['Kanit',sans-serif] selection:bg-[#B600A8] selection:text-white overflow-x-clip">
        {/* Global Unified Motion Texture */}
        <GlobalMotionTexture />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Marquee Section */}
      <MarqueeSection />

      {/* 3. About Section */}
      <AboutSection />

      {/* 4. Services Section */}
      <ServicesSection />

      {/* 5. Projects Section */}
      <ProjectsSection />

      {/* 6. Experience Section */}
      <ExperienceSection />

      {/* 7. Tech Stack / Tools Section */}
      <ToolsSection />
    </main>
    </ContactMenuProvider>
  );
}

export default App;

