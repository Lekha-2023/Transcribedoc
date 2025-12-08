import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import DemoUpload from "@/components/home/DemoUpload";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <div id="demo-section">
        <DemoUpload />
      </div>
      <BenefitsSection />
      <Footer />
    </div>
  );
};

export default Index;